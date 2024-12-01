import { FollowerPointer } from "@/components/ui/follower-pointer";
import { RecipeType } from "@/types";
import removeMd from "remove-markdown"
import { Link } from "react-router-dom";

export function RecipeCard({
  recipe
}:{
  recipe:RecipeType
}) {
  return (
    <div className="w-80 h-[446px] mx-auto">
      <FollowerPointer
        title={
          <TitleComponent
            label={recipe.recipe_name}
            avatar={null}
          />
        }
      >
        <div className="relative overflow-hidden h-full rounded-2xl transition duration-200 group bg-white hover:shadow-xl border border-zinc-100">
          <div className="w-full aspect-w-16 aspect-h-10 h-[200px] bg-gray-100 rounded-tr-lg rounded-tl-lg overflow-hidden xl:aspect-w-16 xl:aspect-h-10 relative">
            <img
              src={recipe.image}
              alt="thumbnail"
              className={`group-hover:scale-95 group-hover:rounded-2xl transform object-cover transition duration-200 `}
            />
          </div>
          <div className=" p-4">
            <h2 className="font-bold my-4 text-lg text-zinc-700">
              {recipe.recipe_name}
            </h2>
            <h2 className="font-normal my-4 text-sm text-zinc-500">
              {removeMd(recipe.ingredients).slice(0,100)}...
            </h2>
            <div className="flex flex-row justify-between items-center mt-10">
              <Link to={`/recipes/${recipe._id}`} className="relative ml-auto rounded-md z-10 px-6 py-2 hover:bg-[var(--primary-01)] bg-[var(--primary-01)] text-white font-bold block text-xs">
                View recipe
              </Link>
            </div>
          </div>
        </div>
      </FollowerPointer>
    </div>
  );
}

const TitleComponent = ({
  label,
  avatar,
}: {
  label: string;
  avatar: string|null;
}) => (
  <div className="flex space-x-2 items-center bg-pink-600 rounded-[50px] h-[30px] px-2">
    {avatar?(
      <img
        src={avatar}
        height="20"
        width="20"
        alt="thumbnail"
        className="rounded-full border-2 border-white"
      />
    ):(
      <div className="uppercase flex items-center justify-center h-[20px] w-[20px] rounded-full bg-gray-500">
        <p className="text-xs">{label.slice(0,2)}</p>
      </div>
    )}
    <p>{label}</p>
  </div>
);
