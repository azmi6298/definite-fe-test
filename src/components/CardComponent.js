export default function CardComponent({ dealer }) {
  return (
    <a href="#" className="data-card" onClick={console.log("clicked")}>
      <h3>{dealer.title}</h3>
      <p>{dealer.address}</p>
      <div className="services">
        {dealer.services &&
          dealer.services
            .slice(0, 3)
            .map((service, index) => <p key={index}>{service}</p>)}
      </div>
    </a>
  );
}
