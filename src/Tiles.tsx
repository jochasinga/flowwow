import Card from "Card";
import Pet from "pet";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

interface SlideArrowProps {
  className?: string;
  style?: object;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  direction?: string;
  hide?: boolean;
};

function SlideArrow({ className, style, hide, onClick, direction }: SlideArrowProps) {
  const margin = direction === "left" ? { marginRight: -30} : { marginLeft: -30};
  return (
    <div className=" is-flex is-flex-direction-column is-justify-content-center">
      <button
        style={{zIndex: 1, ...margin}}
        className={`button is-light is-large ${hide || "is-invisible"}`}
        onClick={onClick}
      >
        <span className="icon">
          <FontAwesomeIcon
            size="1x"
            icon={direction === "left"
              ? faAngleLeft
              : faAngleRight
            }
          />
        </span>
      </button>
    </div>
  );
}


function Tiles({ pets, user, isActivated, heading }: TilesProps) {

  // FIXME: This is a quick hack
  // let myPets1 = pets.slice(0, 4);
  // let myPets2 = pets.slice(4);
  const [hover, setHover] = useState(false);

  let counter = 1;

  const settings = (hide: boolean) => ({
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 4,
    nextArrow: <SlideArrow direction="right" hide={hide} />,
    prevArrow: <SlideArrow direction="left" hide={hide} />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  return (
    <section className="section mx-6">
      <span className="tag is-light is-large is-rounded block">
        {heading || "Hello, there"}
      </span>
      { pets.length > 0
        ? (
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <Slider {...settings(hover)} className="columns block">
            {
              [
                pets.map((pet: Pet) => {
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
                }),
                ...Array.from({length: 4}, (x, i) => i)
                  .map((i) => {
                    <div className="column">
                      <Card
                        pet={{name: ""} as any}
                        key={counter}
                        id={counter}
                        user={user}
                        isActivated={isActivated} 
                        empty={true} 
                      />
                    </div>
                  })
              ]
            }
          </Slider>
          {/* </div> */}
          {/* <div className="columns block">
            {
              myPets2.map((pet: Pet) => {
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
          </div> */}
        </div>
      ) : (
        <div
          className="is-flex is-justify-content-center is-flex-direction-column"
          style={{minHeight: 300}}
        >
          <p className="subtitle">Nothing to see here</p>
        </div>
      )
    }
    </section>
  );
}

interface TilesProps {
  pets: Pet[],
  user: any,
  isActivated: boolean,
  heading?: string,
}

export default Tiles;