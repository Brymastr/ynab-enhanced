import * as ynab from 'ynab';
import { connect } from 'react-redux';
import AuthButton from './AuthButton';


const mapStateToProps = state => ({
  // invitee: state.invitee.invitee,
});

const mapDispatchToProps = dispatch => ({
  // weddingDateSet: (payload) => dispatch({ type: WEDDING_DATE_SET, payload }),
});


class Auth {

}


export default connect(mapStateToProps, mapDispatchToProps)(Auth);
