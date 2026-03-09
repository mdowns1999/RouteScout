import { Button, Chip, LinearProgress, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom"
import LayoutBand from "../../components/UI/Layoutband/LayoutBand"
import Heading from "../../components/UI/Heading/Heading"
import Paragraph from "../../components/UI/Paragraph/Paragraph"
import useIsMobile from "../../hooks/useIsMobile"
import { useState } from "react"
import LocationsView from "../../components/LocationsView/LocationsView"
import InterestsView from "../../components/InterestsView/InterestsView"
import SuggestedStops from "../../components/SuggestedStops/SuggestedStops"
import TripSummary from "../../components/TripSummary/TripSummary"
import Separator from "../../components/UI/Separator/Separator"
import { useTripPlan } from "../../contexts/TripPlanContext"

interface ProgressLabelProps {
  number: string;
  label: string;
  isMobile?: boolean;
  filled?: boolean;
}

const ProgressLabel: React.FC<ProgressLabelProps> = ({
  number,
  label,
  isMobile = true,
  filled = false,
}) => {
  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{ justifyContent: "space-between", alignItems: "center" }}
    >
      <Chip
        label={number}
        size="small"
        color={filled ? "secondary" : "primary"}
        variant={filled ? "filled" : "outlined"}
      />
      {!isMobile && <Paragraph size="xs">{label}</Paragraph>}
    </Stack>
  )
}

export default function TripPage() {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const { isStep1Valid, isStep2Valid, isStep3Valid } = useTripPlan()

  const ProgressObj = [
    {
      number: "1",
      label: "Planning",
      filled: true,
      progress: 25,
      component: <LocationsView />,
      nextBtnLabel: "Continue to Interests",
      previousBtnLabel: null,
    },
    {
      number: "2",
      label: "In Progress",
      filled: false,
      progress: 50,
      component: <InterestsView />,
      nextBtnLabel: "Continue to Suggested Stops",
      previousBtnLabel: "Back to Locations",
    },
    {
      number: "3",
      label: "Completed",
      filled: false,
      progress: 75,
      component: <SuggestedStops />,
      nextBtnLabel: "Continue to Trip Summary",
      previousBtnLabel: "Back to Interests",
    },
    {
      number: "4",
      label: "Reviewed",
      filled: false,
      progress: 100,
      component: <TripSummary />,
      nextBtnLabel: "Export Your Trip",
      previousBtnLabel: "Back to Suggested Stops",
    },
  ]

  const progressNum = ProgressObj[progress].progress

  // Validation - determine if current step is valid
  const isCurrentStepValid = () => {
    switch (progress) {
      case 0:
        return isStep1Valid()
      case 1:
        return isStep2Valid()
      case 2:
        return isStep3Valid()
      case 3:
        return true // Summary page is always valid
      default:
        return false
    }
  }

  // Use space-between when both buttons exist (back + next/export), center when only one (just next)
  const hasPrevious = progress > 0
  const spacingCSS = hasPrevious
    ? { justifyContent: "space-between" }
    : { justifyContent: "center" }

  return (
    <LayoutBand>
      <Stack>
        <div>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Heading level="h1" size="h2">
              Progress
            </Heading>
            <span>{progressNum}%</span>
          </Stack>
          <LinearProgress
            sx={{ height: 10, borderRadius: 5 }}
            variant="determinate"
            value={progressNum}
            color="secondary"
          />
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", padding: "5px" }}
          >
            {ProgressObj.map((label) => (
              <ProgressLabel
                key={label.number}
                number={label.number}
                label={label.label}
                isMobile={isMobile}
                filled={label.filled}
              />
            ))}
          </Stack>
        </div>

        {/* Render current step component */}
        {ProgressObj[progress].component}

        <Separator size="nano" />
        <Stack direction="row" sx={spacingCSS}>
          {progress > 0 && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setProgress(progress - 1)}
            >
              {ProgressObj[progress].previousBtnLabel}
            </Button>
          )}
          {progress < ProgressObj.length - 1 ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setProgress(progress + 1)}
              disabled={!isCurrentStepValid()}
            >
              {ProgressObj[progress].nextBtnLabel}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/trip/export")}
              disabled={!isCurrentStepValid()}
            >
              {ProgressObj[progress].nextBtnLabel}
            </Button>
          )}
        </Stack>
      </Stack>
    </LayoutBand>
  )
}
