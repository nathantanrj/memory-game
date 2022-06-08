export default function Card(props) {
    return (
        <div className="card" onClick={() => props.isPaired ? undefined : props.press(props.number,props.name)}>
            {props.isHidden ?  <div className="question-mark">?</div> : 
            <img src={`./images/${props.name}.svg`} alt=""/>
            }
        </div>
    )
}