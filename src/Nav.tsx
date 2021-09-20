import AuthCluster from './AuthCluster';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const Nav = ({setActivated}: any) => {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <h1 className="title">🐶 Flowwow</h1>
          </a>
          <div className="navbar-item">
            <span className="tag is-primary is-rounded is-medium">
              { process.env.REACT_APP_FLOW_NET }
            </span>
          </div>
          <button
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarMenuHero"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>
        <div id="navbarMenuHero" className="navbar-menu">
          <div className="navbar-start">
            <a href="https://ethereum.org/en/nft/" className="navbar-item">
              What is NFT
            </a>
            <a href="https://onflow.org" className="navbar-item">
              Flow
            </a>
            <a href="https://nft.storage/" className="navbar-item">
              NFT Storage
            </a>
          </div>
          <div className="navbar-end">

              <div className="navbar-item">
                <AuthCluster setActivated={setActivated} />
              </div>
            <span className="navbar-item">
              <a className="button is-light" href="https://github.com/jochasinga/flowwow">
                <span className="icon">
                  <FontAwesomeIcon icon={faGithub} size="1x" />
                </span>
                <span>Fork</span>
              </a>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;