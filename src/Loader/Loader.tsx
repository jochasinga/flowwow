import runningPug from "./loader.gif";
import "./loader.scss";

const Loader = ({ message = "Loading...", isActive }: LoaderProps) => (
  <div className={`modal ${isActive && "is-active"}`}>
  <div className="modal-background"></div>
  <div className="modal-content">
      {/* <!-- Any other Bulma elements you want --> */}
    <div className="block loading">
      <img className="runner" src={runningPug} />
      <h1 className="title">{message}</h1>
    </div>
  </div>
  <button className="modal-close is-large" aria-label="close"></button>
  </div >
);

interface LoaderProps {
  message?: string,
  isActive: boolean,
}

export default Loader;