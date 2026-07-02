import { IconFile } from "@douyinfe/semi-icons";
export interface FileManagerGridViewProps {
  data: any[];
  onClickItem: any;
  selected: any;
}

const Item = (props: any) => {
  const { isSelected = false, data, onClick } = props;

  const { originalName, url, fileType } = data;

  const handleOnClick = () => {
    onClick && onClick(data, !isSelected);
  };

  const imageThumbnailRender = () => {
    if (fileType.startsWith("image")) {
      return (
        <img
          src={url}
          alt={originalName}
          className="w-full h-full object-contain cursor-pointer"
        />
      );
    }
    return <IconFile size="extra-large" />;
  };

  return (
    <div className="w-full flex flex-col justify-between gap-0">
      <div
        className={`${isSelected ? "bg-gray-200 " : ""}
        h-28 rounded-md p-3 flex flex-col justify-center items-center`}
        onClick={handleOnClick}
      >
        {imageThumbnailRender()}
      </div>
      <div
        className={`text-sm text-center ${
          isSelected ? "text-blue-600 " : ""
        }font-bold cursor-pointer`}
        onClick={handleOnClick}
      >
        <span className="line-clamp-2 break-words">{originalName}</span>
      </div>
    </div>
  );
};

export const GridView = (props: FileManagerGridViewProps) => {
  const { data, onClickItem, selected } = props;

  const getIsActive = (id: any) => {
    return id == selected?.id;
  };

  return (
    <div className="grid grid-cols-3 xs:gap-4 sm:grid-cols-4 sm:gap-4 md:grid-cols-6 md:gap-5 xl:grid-cols-6 xl:gap-5 p-6 max-h-64 overflow-auto">
      {data &&
        data.map((file: any) => (
          <Item
            key={file.id}
            isSelected={getIsActive(file.id)}
            data={file}
            onClick={onClickItem}
          />
        ))}
    </div>
  );
};
