import './Profile.css';

export default function Profile() {
  const handleEditAlamat = () => {
    alert('Edit alamat diklik!');
  };
  return (
    <div className="profile-page">
      <button className="logout-btn">LOG OUT</button>
      <div className="profile-content">
        <img className="profile-img" src="https://i.ibb.co/6bQ6Q0P/white-kitty.jpg" alt="profile" />
        <div className="profile-name">LORD ADI</div>
        <div className="profile-label">Email</div>
        <div className="profile-box"><a href="mailto:singaraja113@gmail.com">singaraja113@gmail.com</a></div>
        <div className="profile-label">Nomor Telepon</div>
        <div className="profile-box">08967327323323</div>
        <div className="profile-label">Alamat Lengkap</div>
        <div className="profile-box profile-box-alamat">
          Jalan Nuri GG 1 NO 2 Kaliuntu, di samping kober pelang Permata Salon
          <span className="edit-addr" onClick={handleEditAlamat}><svg width="20" height="20" viewBox="0 0 20 20"><path d="M14.85 2.85a1.2 1.2 0 0 1 1.7 1.7l-1.1 1.1-1.7-1.7 1.1-1.1zm-2 2 1.7 1.7-7.2 7.2c-.1.1-.2.2-.3.3l-2.1.6.6-2.1c.1-.1.2-.2.3-.3l7.2-7.2z" fill="#a7374a"/></svg></span>
        </div>
      </div>
    </div>
  );
} 