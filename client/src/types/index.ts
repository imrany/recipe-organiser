export type RecipeType={
    _id:string,
    recipe_name: string,
    ingredients: string,
    directions: string,
    email: string,
    image:string,
    created_at: string
}

export type UserType={
    email: string,
    type: string,
    username: string,
    photo: string | null,
    created_at: string,
    token?:string
}