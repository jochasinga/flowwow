interface  Pet {
    name:  string;
    age: string;
    breed: string;
    sex: string;
    color: string;
    kind: string;
    photo?: string;
    uri?: string;
}

export const petToCadenceDict = (pet: any) => (
    Object.keys(pet).map((k, i) => (
        {key: k, value: pet[k]}
    ))
);

export default Pet;

