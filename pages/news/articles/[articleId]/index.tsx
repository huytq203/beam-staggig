import { ContentWrapper } from "@components/widgets";
import { PrimaryLayout } from "@components/widgets/Layouts";
import { Notification } from "@douyinfe/semi-ui";
import { NewsArticleForm } from "@modules/news";
import { NewsService } from "@services/news";
import { useRouter } from "next/router";

export async function getServerSideProps(props: any) {
  const { locale } = props;
  const { articleId } = props.params;

  return {
    props: {
      articleId: articleId,
    },
  };
}
export default function NewsArticleUpdatePage(props: any) {
  const { articleId } = props;
  const router = useRouter();
  const onUpdate = async (values: any) => {
    const response = await NewsService.updateArticle(articleId, values);
    if (response) {
      Notification.success({
        content: `Cập nhật thành công`,
        theme: "light",
      });
    }
    onCancel();
  };

  const onCancel = () => {
    router.push("/news/articles");
  };

  return (
    <PrimaryLayout breadcrumbs={["Bài viết"]}>
      <ContentWrapper pageTitle="Cập nhật tin tức">
        <NewsArticleForm
          onSubmit={onUpdate}
          isNew={false}
          articleId={articleId}
          onCancel={onCancel}
        />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
