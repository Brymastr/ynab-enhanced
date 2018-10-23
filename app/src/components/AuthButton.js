import * as ynab from "ynab";


const AuthButton = ({ onClick }) => (
  <div>
    <button onClick={onClick}>
      login
    </button>
  </div>
);


AuthButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default AuthButton