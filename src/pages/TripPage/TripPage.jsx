import { Button, Chip, LinearProgress, Stack } from "@mui/material"
import LayoutBand from "../../components/UI/Layoutband/LayoutBand"
import Heading from "../../components/UI/Heading/Heading"
import Paragraph from "../../components/UI/Paragraph/Paragraph"
import useIsMobile from "../../hooks/useIsMobile"
import { useState } from "react"
import LocationsView from "../../components/LocationsView/LocationsView"

const ProgressLabel = ({number, label, isMobile = true, filled=false}) => {
  return (
    <Stack direction='row' spacing={0.5} sx={{justifyContent: 'space-between', alignItems: 'center'}}>
        <Chip label={number}  size="small" color="primary" variant={filled ? "filled" : "outlined"}/>
        {!isMobile && <Paragraph size='xs'>{label}</Paragraph>}
    </Stack>
  )
}


export default function TripPage() {
  const isMobile = useIsMobile()
const [progress, setProgress] = useState(0)

  const ProgressLabels = [
    { number: "1", label: "Planning", filled: true, progress: 25 },
    { number: "2", label: "In Progress", filled: false, progress: 50 },
    { number: "3", label: "Completed", filled: false, progress: 75 },
    { number: "4", label: "Reviewed", filled: false, progress: 100 },
  ]

  const progressNum = ProgressLabels[progress].progress

  // Use space-between when both buttons exist, center when only one
  const hasNext = progress < ProgressLabels.length - 1
  const hasPrevious = progress > 0
  const spacingCSS = hasNext && hasPrevious 
    ? { justifyContent: 'space-between' } 
    : { justifyContent: 'center' }
    
  return (
    <LayoutBand>
      <Stack>
        <div>
          <Stack direction='row' sx={{justifyContent: 'space-between', alignItems: 'center'}}>
            <Heading level="h1" size="h2">Progress</Heading>
            <span>{progressNum}%</span>
          </Stack>
           <LinearProgress sx={{height: 10, borderRadius: 5}} variant="determinate" value={progressNum} />
          <Stack direction='row' sx={{justifyContent: 'space-between', padding: '5px'}}>
{ProgressLabels.map((label) => (
  <ProgressLabel key={label.number} number={label.number} label={label.label} isMobile={isMobile} filled={label.filled} />
))}

          </Stack>
           
        </div>
      
      <LocationsView />

      <Stack direction="row" sx={spacingCSS}>
       {progress > 0 && (
        <Button 
          variant="outlined" 
          color="primary"
          onClick={() => setProgress(progress - 1)}
        >
          Previous
        </Button>
       )}
        {progress < ProgressLabels.length - 1 && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => setProgress(progress + 1)}
          >
            Next
          </Button>
        )}
      </Stack>
    </Stack>
    </LayoutBand>
  )
}
