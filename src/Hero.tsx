import Nav from "Nav";
import "./Hero.scss";

function Hero({ setActivated }: HeroProps) {
  return (
    <section className="hero is-primary is-medium">
      <div className="hero-head">
        <Nav setActivated={setActivated} />
      </div>
      <div className="hero-body">
        <div className="container has-text-centered">
          <p className="title">
            NFT Pet Store
          </p>
          <p className="subtitle">
            Adopt these cute furballs
          </p>
        </div>
      </div>

      <div className="hero-foot">
      </div>
    </section>
  );
}

interface HeroProps {
  setActivated: (flag: boolean) => void
}

export default Hero;