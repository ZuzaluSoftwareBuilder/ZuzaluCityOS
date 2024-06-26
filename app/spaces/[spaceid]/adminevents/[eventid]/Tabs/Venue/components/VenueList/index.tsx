import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import ZuButton from 'components/core/Button';
import { PlusIcon, PlusCircleIcon, SearchIcon } from 'components/icons';
import { VenueDTO } from '@/types';
import VenueCard from './VenueCard';
import { ZuInput } from '@/components/core';
import { supabase } from '@/utils/supabase/client';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface VenueListProps {
  venues?: VenueDTO[];
  onToggle: (anchor: Anchor, open: boolean) => void;
}

const VenueList: React.FC<VenueListProps> = ({ venues, onToggle }) => {

  const [searchString, setSearchString] = React.useState<string>('');
  const [filteredVenues, setFilteredVenues] = React.useState<VenueDTO[]>([]);

  const getVenues = async (searchString: string) => {
    try {
      const result = await supabase.from('venue').select().like('name', `%${searchString}%`);
      if(result.error) {
        console.log('ERROR: SUPABASE: GET VENUES: ', result.error);
        return ;
      }
      setFilteredVenues(result.data)
    } catch (err) {
      console.log('ERROR: SUPABASE: GET VENUES: ', err)
    }

  }

  React.useEffect(() => {
    getVenues(searchString)
  }, [searchString])

  return (
    <Stack direction="column" spacing={0.5}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">Spaces</Typography>
        <ZuButton
          startIcon={<PlusIcon />}
          onClick={() => onToggle('right', true)}
        >
          Add a Space
        </ZuButton>
      </Stack>
      <Typography variant="body2">
        These are bookable areas at or near a venue for sessions
      </Typography>
      {
        venues?.length === 0 ? (
          <Stack
            direction="column"
            alignItems="center"
            bgcolor="#2d2d2d"
            padding="20px 10px"
            borderRadius={2}
          >
            <PlusCircleIcon color="#6c6c6c" size={15} />
            <Typography variant="subtitle2">No Spaces</Typography>
            <Typography variant="body2">Add a Space</Typography>
          </Stack>
        ) : <Stack paddingY="20px" spacing="10px">
          <ZuInput
            startAdornment={
              <Stack
                sx={{
                  paddingRight: '10px'
                }}
              >
                <SearchIcon />
              </Stack>
            }
            placeholder='Search Venue Spaces'
            sx={{
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '10px'
            }}
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
          {filteredVenues?.map((venue, index) => (
            <VenueCard 
              key={`VenueCard-${index}`}
              {
                ...venue
              }
            />
          ))}
        </Stack>
      }

    </Stack>
  );
};

export default VenueList;
