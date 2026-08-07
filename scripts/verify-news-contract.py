#!/usr/bin/env python3
"""
So sánh BE cũ (Spring) vs beam-stagging local, tách rõ hai loại khác biệt:

  CONTRACT — hình dạng payload: HTTP status, tập khoá, thứ tự khoá, và toàn bộ
             các trường phân trang. Đây là thứ PHẢI khớp tuyệt đối, vì landing
             không đổi code.
  DATA     — giá trị nội dung từng bài. Lệch ở đây là do dữ liệu hai DB đã khác
             nhau, không phải lỗi contract.
"""
import json
import re
import sys
import urllib.request

# Dùng: python3 scripts/verify-news-contract.py [BASE_MOI] [BASE_CU]
OLD = sys.argv[2] if len(sys.argv) > 2 else "https://core.devops.beamewa.com.vn"
NEW = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3999"

# JS Date chỉ có độ phân giải ms, Java có micro giây → cắt về 3 chữ số.
TS = re.compile(r"^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3})\d*$")

PAGE_FIELDS = [
    "totalElements", "totalPages", "last", "size", "number",
    "numberOfElements", "first", "empty",
]

contract_fails: list[str] = []
data_diffs: list[str] = []


def get(base, path):
    req = urllib.request.Request(base + path, headers={"User-Agent": "verify"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())


def norm_ts(v):
    if isinstance(v, str):
        m = TS.match(v)
        if m:
            return m.group(1)
    return v


def eq(label, a, b, bucket):
    if a != b:
        bucket.append(f"{label}: cũ={a!r:.120} | mới={b!r:.120}")
        return False
    return True


def check_list(label, path):
    s_old, d_old = get(OLD, path)
    s_new, d_new = get(NEW, path)

    eq(f"{label} :: HTTP status", s_old, s_new, contract_fails)
    eq(f"{label} :: khoá gốc", list(d_old), list(d_new), contract_fails)
    eq(f"{label} :: message", d_old.get("message"), d_new.get("message"), contract_fails)
    eq(f"{label} :: code", d_old.get("code"), d_new.get("code"), contract_fails)

    po, pn = d_old["data"], d_new["data"]
    eq(f"{label} :: data.khoá", list(po), list(pn), contract_fails)
    eq(f"{label} :: pageable", po["pageable"], pn["pageable"], contract_fails)
    eq(f"{label} :: sort", po["sort"], pn["sort"], contract_fails)
    for f in PAGE_FIELDS:
        eq(f"{label} :: {f}", po[f], pn[f], contract_fails)

    for i, (a, b) in enumerate(zip(po["content"], pn["content"])):
        eq(f"{label} :: content[{i}].khoá", list(a), list(b), contract_fails)
        for k in a:
            if k in b and norm_ts(a[k]) != norm_ts(b.get(k)):
                data_diffs.append(
                    f"{label} content[{i}] ({a.get('slug', '')[:35]}) .{k}: "
                    f"cũ={norm_ts(a[k])!r:.90} | mới={norm_ts(b[k])!r:.90}"
                )


def check_detail(label, path):
    s_old, d_old = get(OLD, path)
    s_new, d_new = get(NEW, path)

    eq(f"{label} :: HTTP status", s_old, s_new, contract_fails)
    eq(f"{label} :: khoá gốc", list(d_old), list(d_new), contract_fails)
    eq(f"{label} :: message", d_old.get("message"), d_new.get("message"), contract_fails)
    eq(f"{label} :: code", d_old.get("code"), d_new.get("code"), contract_fails)

    a, b = d_old.get("data"), d_new.get("data")
    if a is None or b is None:
        eq(f"{label} :: data", a, b, contract_fails)
        return
    eq(f"{label} :: data.khoá", list(a), list(b), contract_fails)
    for k in a:
        if k in b and norm_ts(a[k]) != norm_ts(b.get(k)):
            data_diffs.append(
                f"{label} .{k}: cũ={norm_ts(a[k])!r:.90} | mới={norm_ts(b[k])!r:.90}"
            )


check_list("list mặc định", "/news/landing?name=&page=1&size=10")
check_list("list size=2 p1", "/news/landing?name=&page=1&size=2")
check_list("list size=2 p2", "/news/landing?name=&page=2&size=2")
check_list("list size=2 p3", "/news/landing?name=&page=3&size=2")
check_list("list trang rỗng", "/news/landing?name=&page=99&size=10")
check_list("list thiếu param", "/news/landing")
check_detail("detail 404", "/news/detail/khong-ton-tai-abc-xyz")

_, listing = get(OLD, "/news/landing?name=&page=1&size=100")
for item in listing["data"]["content"]:
    check_detail(f"detail[{item['slug'][:32]}]", f"/news/detail/{item['slug']}")

print("=" * 72)
print(f"CONTRACT  — {len(contract_fails)} khác biệt")
print("=" * 72)
for x in contract_fails:
    print("  ✗", x)
if not contract_fails:
    print("  ✓ Khớp tuyệt đối: status, envelope, thứ tự khoá, toàn bộ phân trang.")

print()
print("=" * 72)
print(f"DATA      — {len(data_diffs)} khác biệt (dữ liệu 2 DB, không phải contract)")
print("=" * 72)
for x in data_diffs:
    print("  •", x)

sys.exit(0 if not contract_fails else 1)
