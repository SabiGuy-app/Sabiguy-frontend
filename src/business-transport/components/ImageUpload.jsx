// import { useState } from "react";
import { CloudUploadIcon } from "../dashboard/icons/index";

const ImageUpload = () => {
  // const [uploadImg, setUploadImg] = useState(null);

  // const handleUpload = (e) => {
  //   const image = e.target.files.length > 0;

  //   if (image) {
  //     setUploadImg(e.target.files[0]);
  //   }
  // };

  return (
    <div className="w-full">
      <label
        htmlFor="upload"
        className="flex w-full rounded-lg border-[#231F2080] h-[149px] cursor-pointer flex-col items-center justify-center border border-dashed "
      >
        <CloudUploadIcon className="size-12 stroke-1 mb-5 text-[#005823]" />
        <h2 className="mb-1">
          Upload pictures
          <span className="font-semibold text-[#005823] pl-1">Browse</span>
        </h2>
        <p className="text-xs text-[#231F2080]">
          JPEG, PNG, PDF format, Max 5 MB each
        </p>

        {/* {uploadImg && (
          <p className="mt-5 text-green-700 font-medium">{uploadImg.name}</p>
        )} */}
      </label>

      {/* <input
        type="file"
        id="upload"
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={handleUpload}
      /> */}
    </div>
  );
};

export default ImageUpload;
