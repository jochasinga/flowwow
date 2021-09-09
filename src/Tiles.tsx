import Card from "Card";
import Pet from "pet";

function Tiles({ pets, user, isActivated }: TilesProps) {

  // FIXME: This is a quick hack
  let myPets1 = pets.slice(0, 4);
  let myPets2 = pets.slice(4);
  let counter = 1;

  return (
    <section className="section mx-6">
      <div className="block">
        <div className="columns block">
          {
            myPets1.map((pet: Pet) => {
              const el = (
                <div className="column">
                  <Card
                    pet={pet}
                    key={counter}
                    id={counter}
                    user={user}
                    isActivated={isActivated}
                  />
                </div>
              );
              counter += 1;
              return el;
            })
          }
        </div>
        <div className="columns block">
          {
            myPets2.map((pet: Pet, id: number) => {
              const el = (
                <div className="column">
                  <Card
                    pet={pet}
                    key={counter}
                    id={counter}
                    user={user}
                    isActivated={isActivated}
                  />
                </div>
              );
              counter += 1;
              return el;
            })
          }
        </div>
      </div>
    </section>
  );
}

interface TilesProps {
  pets: Pet[],
  user: any,
  isActivated: boolean,
}

export default Tiles;