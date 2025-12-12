/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import Heading from "../../../components/UI/Heading/Heading"
import Paragraph from "../../../components/UI/Paragraph/Paragraph"
import Row from "../../../components/UI/Row/Row"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import MapIcon from "@mui/icons-material/Map"

const getIconBoxCss = () => css`
alignSelf: "flex-start"
  text-align: center;
  background-color: gray;
  padding: 8px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  
`

export default function BenefitsRow() {
  // TODO: REPLACE WITH ACTUAL CONTENT AND ICONS
  const cardContent = [
    {
      icon: <LocationOnIcon fontSize="large" />,
      title: "Set Your Route",
      description:
        "Enter your starting point and destination, plus any travel preferences",
    },
    {
      icon: <StarBorderIcon fontSize="large" />,
      title: "Choose Your Activities",
      description:
        "Select from categories like food, nature, history, and attractions",
    },
    {
      icon: <MapIcon fontSize="large" />,
      title: "Get Your Trip",
      description:
        "Review smart suggestions and export your trip to Google or Apple Maps",
    },
  ]

  return (
    <Row wrap alignX="center" >
      {cardContent.map((card) => (
        <div key={card.title} style={{ maxWidth: "300px" }}>
          <Row gutters="xs">
            <div css={getIconBoxCss}>{card.icon}</div>
            <div>
              <Heading level="h3" size="h5">
                {card.title}
              </Heading>
              <Paragraph size="xs">{card.description}</Paragraph>
            </div>
          </Row>
        </div>
      ))}
    </Row>
  )
}
