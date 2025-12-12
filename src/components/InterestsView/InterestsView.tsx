import { Card, CardActionArea, CardContent, Grid, Box, Typography } from '@mui/material'
import { useState } from 'react'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import NatureIcon from '@mui/icons-material/Nature'
import MuseumIcon from '@mui/icons-material/Museum'
import TerrainIcon from '@mui/icons-material/Terrain'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import PaletteIcon from '@mui/icons-material/Palette'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import StarIcon from '@mui/icons-material/Star'
import PlaceIcon from '@mui/icons-material/Place'
import Heading from '../UI/Heading/Heading'
import Paragraph from '../UI/Paragraph/Paragraph'
import LayoutBand from '../UI/Layoutband/LayoutBand'

const categories = [
  {
    id: 'food',
    title: 'Food & Dining',
    description: 'Local restaurants, food trucks, breweries',
    icon: <RestaurantIcon  />
  },
  {
    id: 'nature',
    title: 'Nature & Outdoors',
    description: 'Parks, hiking trails, scenic viewpoints',
    icon: <NatureIcon  />
  },
  {
    id: 'history',
    title: 'History & Culture',
    description: 'Museums, historical sites, landmarks',
    icon: <MuseumIcon  />
  },
  {
    id: 'adventure',
    title: 'Adventure Sports',
    description: 'Hiking, climbing, water sports',
    icon: <TerrainIcon />
  },
  {
    id: 'photography',
    title: 'Photography Spots',
    description: 'Scenic views, Instagram-worthy locations',
    icon: <CameraAltIcon  />
  },
  {
    id: 'arts',
    title: 'Arts & Entertainment',
    description: 'Galleries, theaters, art districts',
    icon: <PaletteIcon  />
  },
  {
    id: 'music',
    title: 'Music & Nightlife',
    description: 'Live music venues, bars, clubs',
    icon: <MusicNoteIcon  />
  },
  {
    id: 'shopping',
    title: 'Shopping',
    description: 'Local markets, unique stores, outlets',
    icon: <ShoppingBagIcon  />
  },
  {
    id: 'attractions',
    title: 'Tourist Attractions',
    description: 'Famous landmarks, theme parks',
    icon: <StarIcon />
  },
  {
    id: 'hidden',
    title: 'Hidden Gems',
    description: 'Off-the-beaten-path discoveries',
    icon: <PlaceIcon  />
  }
]

export default function InterestsView(){
  const [selected, setSelected] = useState<string[]>([])

  const handleSelect = (catId: string) => {
    setSelected(prev => 
      prev.includes(catId) 
        ? prev.filter(id => id !== catId)
        : [...prev, catId]
    )
  }

  return (
    <LayoutBand spacing="lg">
      <Heading level="h1" size="h2" centered>
        What Interests You?
      </Heading>
      <Paragraph centered>
        Select the categories that match your interests. We'll use these to suggest amazing stops along your route.
      </Paragraph>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {categories.map((cat) => {
          const isSelected = selected.includes(cat.id)
          return (
            <Grid key={cat.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card 
                sx={{ 
                  height: '100%',
                  border: 2,
                  borderColor: isSelected ? 'primary.main' : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.light'
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => handleSelect(cat.id)}
                  sx={{ height: '100%' }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Box sx={{ 
                        bgcolor: isSelected ? 'primary.light' : 'grey.100',
                        color: isSelected ? 'primary.contrastText' : 'text.primary',
                        p: 1.5, 
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 56,
                        minHeight: 56,
                        transition: 'all 0.2s'
                      }}>
                        {cat.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Heading level="h3" size="h6">
                          {cat.title}
                        </Heading>
                        <Paragraph size="xs" >
                          {cat.description}
                        </Paragraph>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {selected.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {selected.length} {selected.length === 1 ? 'category' : 'categories'} selected
          </Typography>
        </Box>
      )}
    </LayoutBand>
  )
}