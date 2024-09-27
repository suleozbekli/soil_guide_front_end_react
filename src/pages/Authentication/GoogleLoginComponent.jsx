import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginComponent = () => {
    const handleSuccess = (credentialResponse) => {
        axios.post('http://localhost:8080/api/users/api/google-login', { tokenId: credentialResponse.credential }) // tokenId burada doğru şekilde gönderilmeli
            .then((response) => {
                console.log(response.data); // Yanıtı kontrol edin
                window.location.href = '/home';  // Giriş başarılıysa yönlendir
            })
            .catch((error) => {
                console.error('Login failed', error);
            });
    };

    const handleFailure = (error) => {
        console.error('Google login failed', error);
    };

    return (
        <div>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleFailure}
                logo_alignment="left"
            />
        </div>
    );
};

export default GoogleLoginComponent;
