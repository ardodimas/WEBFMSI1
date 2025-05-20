const Label = ({label,background}) => {
    return(
        <div style={{background: background}}>
            <span>{label % 2 === 0 ? "Genap" : "Ganjil"}</span>
        </div>
    );
};

export default Label;