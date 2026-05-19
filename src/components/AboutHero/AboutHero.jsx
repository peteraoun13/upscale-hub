import './AboutHero.css'

export default function AboutHero({ title, image, children }) {
  return (
    <div className="about-hero">
      <img src={image} alt="" className="about-hero__img" />
      <div className="about-hero__content">
        <h1 className="about-hero__title">{title}</h1>
        <div className="about-hero__body">{children}</div>
      </div>
    </div>
  )
}