import Layout from "@/components/admin/layout";
import Link from "next/link";
import { FC } from "react";
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
import InputSelect from "@/components/admin/elements/select";

interface PageProps {
  id: string;
}

const UpdateDestinationPage: FC<PageProps> = (props) => {
  const { state, actions } = useUpdateDestination(props.id);

  return (
    <Layout>
      <div className="p-2 md:p-6 w-full">
        <h1 className="text-2xl md:text-3xl mb-6">Update Destination</h1>
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
          className="max-w-xl flex flex-col gap-4 mt-12"
        >
          {state.formData.uploaded_video && (
            <div className="relative w-full h-full">
              <VideoPlayer
                className="w-full aspect-video rounded"
                videoUrl={state.formData.uploaded_video}
              />
            </div>
          )}
          <Input
            type="file"
            name="video"
            label="Video"
            onChange={(e) => actions.handleChange(e.target.files, "video")}
            error={state.errors.video}
          />
          <div className="flex flex-col gap-y-4">
            <Input
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
                    className="relative w-full aspect-video"
                  >
                    <button
                      disabled={state.loading}
                      type="button"
                      onClick={() => actions.handleRemoveImage(image)}
                      className="bg-white text-dark absolute right-2 top-2 p-[2px] z-10 rounded-full bg-opacity-80 hover:bg-opacity-100 transition-all ease-in-out duration-500"
                    >
                      <BsX className="text-dark text-base" />
                    </button>
                    <ImageShimmer
                      priority
                      alt={`upadte-image-${index + 1}`}
                      className="object-cover transform hover:scale-105 transition-transform ease-in-out duration-500"
                      fill
                      src={image}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <Input
            name="title"
            label="Title"
            onChange={(e) => actions.handleChange(e.target.value, "title")}
            value={state.formData.title}
            error={state.errors.title}
          />
          <InputSelect
            label="Category"
            onChange={(e) =>
              actions.handleChange(Number(e.target.value), "categoryId")
            }
            value={state.formData.categoryId?.toString()}
            error={state.errors.categoryId}
            options={state.categoryOptions}
          />
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
            chips={state.formData.inclusions}
            error={state.errors.inclusions}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              full
              type="number"
              name="duration"
              label="Duration (eg. Hour)"
              onChange={(e) => actions.handleChange(e.target.value, "duration")}
              value={state.formData.duration}
              error={state.errors.duration}
            />
            <Input
              full
              type="number"
              name="pax"
              label="Minimum Pax"
              onChange={(e) => actions.handleChange(e.target.value, "pax")}
              value={state.formData.pax}
              error={state.errors.pax}
            />
          </div>
          <Input
            className="col-span-3"
            name="price"
            label="Price"
            onChange={(e) => actions.handleChange(e.target.value, "price")}
            value={state.formData.price}
            error={state.errors.price}
          />

          <div className="flex justify-end">
            <ButtonPrimary
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

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const { id } = context.params as { id: string };

  return {
    props: {
      id,
    },
  };
};

export default UpdateDestinationPage;
