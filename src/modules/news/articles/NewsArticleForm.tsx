import { FileManagerButton } from "@components/shared";
import { InputWrapper } from "@components/shared/InputWrapper";
import { BeamEditor } from "@components/shared/RichText/NanoEditor";
import { FormActionButton } from "@components/widgets";
import { SpinWrapper } from "@components/widgets/ContentWrapper/SpinWrapper";
import { Input, TextArea, Switch, Select } from "@douyinfe/semi-ui";
import { yupResolver } from "@hookform/resolvers/yup";
import { NewsService } from "@services/news";
import { status } from "nprogress";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import slug from "slug";
import { CreateArticleSchema } from "validations/news/Article.schema";

export const NewsArticleForm = (props: any) => {
  const { isNew = true, articleId, onSubmit, onCancel } = props;
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(CreateArticleSchema),
    defaultValues: {
      title: "",
      slug: "",
      coverImage: "",
      description: "",
      status: "ACTIVE",
      shows: false,
    },
  });

  const { data, isLoading } = useQuery(
    ["fee_policy_detail", articleId],
    () => NewsService.getArticle(articleId),
    {
      enabled: !isNew && !!articleId,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  useEffect(() => {
    if (!isLoading && data) {
      reset(data);
    }
  }, [data, isLoading]);

  useEffect(() => {
    setValue("slug", slug(watch("title")));
  }, [watch("title")]);


  const statusValue = watch("status");

  useEffect(() => {
    if (statusValue === "DRAFT") {
      setValue("shows", false);
    }
  }, [statusValue, setValue]);

  const isDisabled = !isNew && data?.status === 'ACTIVE';

  return (
    <>
      <SpinWrapper spinning={loading} size="large">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <span className="font-bold">THÔNG TIN CHUNG</span>
            <div className="flex flex-col gap-4">
              <InputWrapper
                required
                field="title"
                label="Tiêu đề bài viết"
                component={(props: any) => (
                  <Input showClear maxLength={255} {...props} />
                )}
                errors={errors}
                control={control}
              />
              <InputWrapper
                required
                field="slug"
                label="Slug"
                component={(props: any) => (
                  <Input showClear maxLength={255} {...props} />
                )}
                errors={errors}
                control={control}
              />
              <InputWrapper
                field="coverImage"
                label="Ảnh"
                component={(props: any) => (
                  <>
                    <div className="flex items-center gap-4">
                      {watch("coverImage") && (
                        <img
                          className="w-12 h-12 object-cover border-dashed border-gray-500 rounded p-0.5"
                          src={watch("coverImage") as any}
                        />
                      )}

                      <FileManagerButton
                        url="news/upload"
                        urlGet="news/get-all"
                        onOk={(file: any) => {
                          if (file?.name) props.onChange(file?.url);
                        }}
                        fileSize={2048}
                        fileType=".jpg,.png,.jpeg"
                      />
                    </div>
                  </>
                )}
                errors={errors}
                control={control}
              />
              <div className="grid grid-cols-2 gap-4">
                <InputWrapper
                  field="shows"
                  label="Hiển thị"
                  component={(props: any) => (
                    <Switch
                      onChange={props.onChange}
                      checked={props.value}
                      disabled={statusValue === "DRAFT"}
                    />
                  )}
                  errors={errors}
                  control={control}
                />

                <InputWrapper
                  required
                  field="status"
                  label="Trạng thái"
                  component={(props: any) => (
                    <Select optionList={listStatus} {...props} disabled={isDisabled} />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>
              <InputWrapper
                required
                field="description"
                label="Mô tả ngắn"
                component={(props: any) => (
                  <TextArea
                    rows={3}
                    showClear
                    maxLength={120}
                    {...props}
                    placeholder="Mô tả ngắn"
                  />
                )}
                errors={errors}
                control={control}
              />
              <InputWrapper
                field="content"
                label="Nội dung"
                component={(props: any) => (
                  <BeamEditor onChange={props.onChange} value={props.value} />
                )}
                errors={errors}
                control={control}
              />
              <InputWrapper
                field="ref"
                label="Nguồn"
                component={(props: any) => (
                  <Input showClear {...props} placeholder="Nguồn bài viết" />
                )}
                errors={errors}
                control={control}
              />
            </div>
            <FormActionButton onCancel={onCancel} loading={isSubmitting} />
          </div>
        </form>
      </SpinWrapper>
    </>
  );
};

const listStatus = [
  { value: 'ACTIVE', label: 'Phát hành' },
  { value: 'DRAFT', label: 'Lưu nháp' },
];
