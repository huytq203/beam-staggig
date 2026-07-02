import { IconFilter, IconSearch } from "@douyinfe/semi-icons";
import { Button, Input } from "@douyinfe/semi-ui";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export const NewsArticleListFilter = (props: any) => {
  const { onFilter } = props;
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      page: 1,
      currentPage: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
      title: "",
    });
  }, []);
  const onSubmitValues = (values: any) => {
    onFilter(values);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid grid-cols-6 gap-4 items-center">
          <div className="col-span-5">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  size="large"
                  prefix={<IconSearch />}
                  showClear
                  autoComplete="off"
                  placeholder="Tiêu đề bài viết"
                  {...field}
                />
              )}
            />
          </div>
          <div className="col-span-1">
            <Button
              icon={<IconFilter />}
              theme="solid"
              type="secondary"
              className="w-full"
              htmlType="submit"
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};
