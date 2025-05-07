const Characteristics = () => {
  return (
    <div className="characteristics">
      <h2 className="characteristics__title">Характеристики персонажа</h2>
      <div className="characteristics__stats">
        <div className="characteristics-stat">
          <span className="characteristics-stat__label">Уровень:</span>
          <span className="characteristics-stat__value">1</span>
        </div>
        <div className="characteristics-stat">
          <span className="characteristics-stat__label">Здоровье:</span>
          <span className="characteristics-stat__value">100</span>
        </div>
        <div className="characteristics-stat">
          <span className="characteristics-stat__label">Атака:</span>
          <span className="characteristics-stat__value">10</span>
        </div>
        <div className="characteristics-stat">
          <span className="characteristics-stat__label">Защита:</span>
          <span className="characteristics-stat__value">5</span>
        </div>
        <div className="characteristics-stat">
          <span className="characteristics-stat__label">Стихия:</span>
          <span className="characteristics-stat__value">Пиро</span>
        </div>
      </div>
    </div>
  );
};

export default Characteristics;