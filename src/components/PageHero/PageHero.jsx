import './PageHero.css'

export default function PageHero({ title, image }) {
  return (
    <div className="page-hero">
      <img
        src={image}
        alt=""
        className="page-hero__img"
      />
      <div className="page-hero__overlay" />
      <h1 className="page-hero__title">{title}</h1>
    </div>
  )
}