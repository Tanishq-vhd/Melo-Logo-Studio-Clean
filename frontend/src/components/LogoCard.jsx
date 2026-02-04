export default function LogoCard({ img, title }) {
  return (
    <div className="logo-box">
      <img src={img} alt={title} />
      <p>{title}</p>
    </div>
  );
}
