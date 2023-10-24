

export default function NewsUnit(props) {
const { title, description, date, link } = props


    return (
        <div>
            <li>{title}</li>
            <li>{description}</li>
            <br />
        </div>
        
    )
}