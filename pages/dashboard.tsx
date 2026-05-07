import { PrimaryLayout } from '@components/widgets/Layouts';
import {
  GrDocumentText,
  GrDocumentVerified,
  GrDocumentUpload,
  GrDocumentExcel,
} from 'react-icons/gr';
export async function getServerSideProps(context: any) {
  return {
    props: {},
  };
}

export default function HomePage() {
  const linkStyle = 'no-underline font-semibold text-blue-500 mb-3 text-lg';

  return (
    <PrimaryLayout>
      <div className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-5 xl:grid-cols-5 gap-7">
          <div className="xl:w-[200px] xl:h-[220px]  block p-3 bg-white border border-gray-200 rounded hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div className=" flex items-center justify-center mb-3">
              <GrDocumentText fontSize={'60px'} color="gray" />
            </div>
            <p className="font-normal text-gray-700 dark:text-gray-400 text-center">
              <a
                className={linkStyle}
                href="https://beamewavn-my.sharepoint.com/:b:/g/personal/support_beamewa_com_vn/EVq--WmncTdCuklphVrpM8IBn5FOEfWwseCL-IRRJV5n2w?e=snKppa"
                target="_blank"
              >
                Hướng dẫn sử dụng app Flexpay cho Người lao động
              </a>
            </p>
          </div>
          <div className="xl:w-[200px] block p-3 bg-white border border-gray-200 rounded hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div className="flex items-center justify-center mb-3">
              <GrDocumentVerified fontSize={'60px'} color="gray" />
            </div>
            <p className="text-center">
              <a
                className={linkStyle}
                href="https://beamewavn-my.sharepoint.com/:b:/g/personal/support_beamewa_com_vn/Eaulgny8ZvlHoq25UG1q_CkBxKRQyRiB0BVZW8Cdx8nqfw?e=Ckew9X"
                target="_blank"
              >
                Hướng dẫn sử dụng doanh nghiệp phê duyệt ứng lương từng lần
              </a>
            </p>
          </div>
          <div className="xl:w-[200px] block p-3 bg-white border border-gray-200 rounded hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div className="flex items-center justify-center mb-3">
              <GrDocumentUpload fontSize={'60px'} color="gray" />
            </div>
            <p className="text-center">
              <a
                className={linkStyle}
                href="https://beamewavn-my.sharepoint.com/:b:/g/personal/support_beamewa_com_vn/EUNIWoMZFgNFvZNV12y0ygYBu1Lpgv8tgiySxWbh65RC8w?e=rz7sS5"
                target="_blank"
              >
                Hướng dẫn sử dụng doanh nghiệp tải lên ngày công
              </a>
            </p>
          </div>
          <div className="xl:w-[200px] block p-3 bg-white border border-gray-200 rounded hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div className="flex items-center justify-center mb-3">
              <GrDocumentExcel fontSize={'60px'} color="gray" />
            </div>
            <p className="text-center">
              <a
                className={linkStyle}
                href="https://beamewavn-my.sharepoint.com/:b:/g/personal/support_beamewa_com_vn/EQMeITg28jxBmhpWKIYLLj4Bs1TK0NMulxGZZHeX4FjeAw?e=Ex1zTX"
                target="_blank"
              >
                Hướng dẫn sử dụng doanh nghiệp ứng lương không theo ngày công
              </a>
            </p>
          </div>
          <div className="xl:w-[200px] block p-3 bg-white border border-gray-200 rounded hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div className="flex items-center justify-center mb-3">
              <GrDocumentText fontSize={'60px'} color="gray" />
            </div>
            <p className="text-center">
              <a
                className={linkStyle}
                href="https://beamewavn-my.sharepoint.com/:b:/g/personal/support_beamewa_com_vn/EVf_e6jpIf5LmhcnmRtyZxEBE2Vacg0yOWrv8hEBZRxm1Q?e=tYAVys"
                target="_blank"
              >
                Hướng dẫn sử dụng doanh nghiệp mặc định
              </a>
            </p>
          </div>
          <div className="xl:w-[200px] xl:h-[220px] block p-3 bg-white border border-gray-200 rounded hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div className="flex items-center justify-center mb-3">
              <GrDocumentText fontSize={'60px'} color="gray" />
            </div>
            <p className="text-center">
              <a
                className={linkStyle}
                href="https://beamewavn-my.sharepoint.com/:b:/g/personal/support_beamewa_com_vn/EZACzsA2fhlLqneHpwCZqnIB9bFcFbUqnH_uRikyTVJ30A?e=fe3FV8"
                target="_blank"
              >
                Hướng dẫn sử dụng doanh nghiệp có thời gian tính hạn mức
              </a>
            </p>
          </div>
          <div className="xl:w-[200px] xl:h-[220px] block p-3 bg-white border border-gray-200 rounded hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div className="flex items-center justify-center mb-3">
              <GrDocumentText fontSize={'60px'} color="gray" />
            </div>
            <p className="text-center">
              <a
                className={linkStyle}
                href="https://beamewavn-my.sharepoint.com/:b:/g/personal/support_beamewa_com_vn/EaTMO19RERpGhEWRlopq-zwB2bauf7BMSWjXOBpKhfCtUw?e=UelgfL"
                target="_blank"
              >
                Hướng dẫn sử dụng doanh nghiệp tích hợp dữ liệu
              </a>
            </p>
          </div>
        </div>
      </div>
    </PrimaryLayout>
  );
}
