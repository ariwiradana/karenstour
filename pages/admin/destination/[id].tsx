import Layout from "@/components/admin/layout";
import Link from "next/link";
import { FC, memo } from "react";
import Input from "@/components/admin/elements/input";
import ButtonPrimary from "@/components/admin/elements/button.primary";
import { HiChevronLeft } from "react-icons/hi2";
import InputChip from "@/components/admin/elements/input.chip";
import useUpdateDestination from "@/hooks/admin/useUpdateDestination";
import { GetServerSideProps } from "next";
import VideoPlayer from "@/components/admin/elements/video.player";
import { BsX } from "react-icons/bs";
import InputTextEditor from "@/components/admin/elements/input.texteditor";
import ImageShimmer from "@/components/client/elements/image.shimmer";
import FsLightbox from "fslightbox-react";
import { BiMap } from "react-icons/bi";
import { parse } from "cookie";
import InputSelect from "@/components/admin/elements/select";

interface PageProps {
  id: string;
  authToken: string;
}

const UpdateDestinationPage: FC<PageProps> = (props) => {
  const { state, actions } = useUpdateDestination(
    props.id,
    props.authToken as string
  );

  return (
    <Layout>
      {state.formData.uploaded_images &&
      state.formData.uploaded_images?.length > 0 ? (
        <FsLightbox
          slide={state.slideIndex}
          toggler={state.lightbox}
          sources={state.formData.uploaded_images}
        />
      ) : (
        <></>
      )}
      <div className="w-full">
        <h1 className="text-2xl md:text-3xl mb-6 font-medium text-admin-dark">
          Update Destination
        </h1>
        <div className="mb-4 flex items-center gap-2">
          <Link
            href="/admin/destination"
            className="flex items-center text-darkgray transition hover:underline"
          >
            <HiChevronLeft className="mr-2 text-lg" />
            <span>Back</span>
          </Link>
        </div>

        <form
          onSubmit={actions.handleSubmit}
          className="xl:max-w-3xl lg:max-w-2xl max-w-xl flex flex-col gap-4 mt-12"
        >
          <Input
            onChange={(e) => actions.handleChange(e.target.value, "title")}
            name="title"
            label="Title"
            value={state.formData.title}
            error={state.errors.title}
          />
          {state.formData.uploaded_video && (
            <div className="relative w-full h-full">
              <VideoPlayer
                className="w-full aspect-video rounded"
                videoUrl={state.formData.uploaded_video}
              />
              <button
                disabled={state.loading}
                type="button"
                onClick={() =>
                  actions.handleRemoveVideo(state.formData.uploaded_video ?? "")
                }
                className="bg-white text-dark absolute right-2 top-2 p-[2px] z-10 rounded-full bg-opacity-80 hover:bg-opacity-100 transition-all ease-in-out duration-500"
              >
                <BsX className="text-dark text-base" />
              </button>
            </div>
          )}
          <Input
            id="video"
            accept="video/*"
            type="file"
            name="video"
            label="Video"
            onChange={(e) => actions.handleChange(e.target.files, "video")}
            error={state.errors.video}
          />
          <div className="flex flex-col gap-y-4">
            <Input
              id="images"
              accept="image/*"
              multiple
              type="file"
              name="images"
              label="Images"
              onChange={(e) => actions.handleChange(e.target.files, "images")}
              error={state.errors.images}
            />
            {(state.formData.uploaded_images ?? [])?.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(state.formData.uploaded_images ?? []).map((image, index) => (
                  <div
                    key={`upadte-image-${index + 1}`}
                    className="relative w-full aspect-video group"
                  >
                    <button
                      disabled={state.loading}
                      type="button"
                      onClick={() => actions.handleRemoveImage(image)}
                      className="bg-white text-dark absolute right-2 top-2 p-[2px] z-10 rounded-full bg-opacity-80 hover:bg-opacity-100 transition-all ease-in-out duration-500"
                    >
                      <BsX className="text-dark text-base" />
                    </button>
                    {state.formData.thumbnail_image !== image && (
                      <button
                        type="button"
                        onClick={() => actions.handleSetThumbnail(image)}
                        className="absolute group-hover:bottom-2 bottom-0 group-hover:visible invisible group-hover:opacity-100 opacity-0 left-2 z-10 bg-white bg-opacity-80 px-2 py-1 text-xs font-medium rounded hover:bg-opacity-100 transition-all ease-in-out duration-500"
                      >
                        Set as Thumbnail
                      </button>
                    )}
                    {state.formData.thumbnail_image === image && (
                      <p className="absolute top-2 left-2 z-10 bg-white bg-opacity-80 px-2 py-1 text-xs font-medium rounded transition-all ease-in-out duration-500">
                        Thumbnail
                      </p>
                    )}
                    <ImageShimmer
                      onClick={() => actions.handleToggleLightbox(index + 1)}
                      sizes="400px"
                      priority
                      alt={`upadte-image-${index + 1}`}
                      className="object-cover transform hover:scale-[1.01] transition-transform ease-in-out duration-500"
                      fill
                      src={image}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          {state.categoryOptions?.length > 0 && (
            <InputSelect
              value={state.formData.category_id as number}
              label="Category"
              options={state.categoryOptions}
              onChange={(e) =>
                actions.handleChange(e.target.value, "category_id")
              }
            />
          )}

          <InputTextEditor
            label="Description"
            onChange={(value) => actions.handleChange(value, "description")}
            value={state.formData.description}
            error={state.errors.description}
          />
          <InputChip
            label="Inclusions"
            id="inclusions"
            onChange={(value) => actions.handleChange(value, "inclusions")}
            chips={state.formData.inclusions || []}
            error={state.errors.inclusions}
          />
          <InputChip
            label="What to Bring"
            id="inventory"
            onChange={(value) => actions.handleChange(value, "inventory")}
            chips={state.formData.inventory || []}
            error={state.errors.inventory}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="duration"
              label="Duration"
              onChange={(e) => actions.handleChange(e.target.value, "duration")}
              value={state.formData.duration}
              error={state.errors.duration}
            />
            <Input
              type="number"
              name="pax"
              label="Minimum Pax"
              onChange={(e) => actions.handleChange(e.target.value, "pax")}
              value={state.formData.pax}
              error={state.errors.pax}
            />
          </div>
          <Input
            inputMode="numeric"
            className="col-span-3"
            name="price"
            type="tel"
            label="Price"
            onChange={(e) => actions.handleChange(e.target.value, "price")}
            value={state.formData.price}
            error={state.errors.price}
          />

          <div className="flex justify-end">
            <ButtonPrimary
              icon={<BiMap />}
              disabled={state.loading}
              title="Update Destination"
              type="submit"
            />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const id = (params?.id as string) || null;
  const cookie = req.headers.cookie || "";

  const authToken = parse(cookie).authToken;

  if (!authToken) {
    res.writeHead(302, { Location: "/admin/login" });
    res.end();
    return {
      props: {},
    };
  }

  return {
    props: {
      id,
      authToken,
    },
  };
};

export default memo(UpdateDestinationPage);
