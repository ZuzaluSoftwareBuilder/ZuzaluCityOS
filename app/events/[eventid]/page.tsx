'use client';
import React, { useEffect, useState } from 'react';
import { useQueryState } from 'nuqs';
import { Stack } from '@mui/material';
import { Thumbnail, Subbar } from './components';
import { About, Sessions, Announcements, PublicSessions } from './tabs';
import { CeramicResponseType, EventEdge, Event } from '@/types';
import { useCeramicContext } from '@/context/CeramicContext';
import { useParams } from 'next/navigation';
import Discussions from './tabs/Discussions';

const Home = () => {
  const [tabName, setTabName] = useQueryState('tab', { defaultValue: 'about' });
  const params = useParams();
  const [eventData, setEventData] = useState<Event>();
  const { composeClient, ceramic } = useCeramicContext();
  const [sessionView, setSessionView] = useState<boolean>(false);
  const [discussionsView, setDiscussionsView] = useState<boolean>(false);
  const [announcementsEdit, setAnnouncementsEdit] = useState<boolean>(false);
  const [verify, setVerify] = useState<boolean>(false);
  const eventId = params.eventid.toString();
  const [urlOption, setUrlOption] = useState<string>('');

  const getEventDetailInfo = async () => {
    try {
      const response: CeramicResponseType<EventEdge> =
        (await composeClient.executeQuery(
          `
        query MyQuery($id: ID!) {
          node (id: $id) {
            ...on ZucityEvent {
                  id
                  scrollpassHash {
                    hash
                  }
                  admins {
                    id
                  }
                  createdAt
                  customLinks {
                    links
                    title
                  }
                  description
                  endTime
                  externalUrl
                  gated
                  imageUrl
                  meetingUrl
                  members {
                    id
                  }
                  spaceId
                  startTime
                  status
                  superAdmin {
                    id
                  }
                  supportChain
                  tagline
                  timezone
                  title
                  tracks
                  space {
                    avatar
                    name
                    id
                  }
                  regAndAccess(first: 1) {
                    edges {
                      node {
                        applicationForm
                        applyOption
                        applyRule
                        checkinOpen
                        id
                        registrationAccess
                        registrationOpen
                        registrationWhitelist {
                          id
                        }
                        scannedList {
                          id
                        }
                        scrollPassContractFactoryID
                        scrollPassTickets {
                          checkin
                          contractAddress
                          description
                          image_url
                          status
                          tbd
                          type
                          name
                          price
                          tokenType
                          disclaimer
                        }
                        ticketType
                        zuPassInfo {
                          access
                          eventId
                          eventName
                          registration
                        }
                        zuLottoInfo {
                          contractAddress
                          description
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
      `,
          {
            id: eventId,
          },
        )) as CeramicResponseType<EventEdge>;
      console.log(response);
      if (response.data) {
        if (response.data.node) {
          setEventData(response.data.node);
          return response.data.node;
        }
      }
    } catch (err) {
      console.log('Failed to fetch event: ', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventDetails = await getEventDetailInfo();
        const userDID = ceramic?.did?.parent.toString().toLowerCase() || '';

        const {
          admins = [],
          superAdmin = [],
          members = [],
        } = eventDetails || {};
        const lowerCaseIds = (arr: any[]) =>
          (arr || []).map((item) => item.id.toLowerCase());

        const adminIds = lowerCaseIds(admins);
        const superAdminIds = lowerCaseIds(superAdmin);
        const memberIds = lowerCaseIds(members);

        setAnnouncementsEdit(
          superAdminIds.includes(userDID) || adminIds.includes(userDID),
        );
        setSessionView(
          superAdminIds.includes(userDID) ||
            adminIds.includes(userDID) ||
            memberIds.includes(userDID),
        );
        setDiscussionsView(
          superAdminIds.includes(userDID) ||
            adminIds.includes(userDID) ||
            memberIds.includes(userDID),
        );

        const storedTab = sessionStorage.getItem('tab');
        if (storedTab) {
          setTabName(storedTab);
          setUrlOption(sessionStorage.getItem('option') || '');
          sessionStorage.setItem('tab', '');
          sessionStorage.setItem('option', '');
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };
    fetchData();
  }, [ceramic?.did?.parent, verify]);

  return (
    <Stack color="white">
      <Thumbnail name={eventData?.title} imageUrl={eventData?.imageUrl} />
      <Subbar
        tabName={tabName}
        setTabName={setTabName}
        canViewSessions={sessionView}
        canViewDiscussions={discussionsView}
      />
      {tabName === 'about' && (
        <About
          eventData={eventData}
          setVerify={setVerify}
          canEdit={announcementsEdit}
        />
      )}
      {tabName === 'sessions' && (
        <Sessions eventData={eventData} option={urlOption} />
      )}
      {tabName === 'public-sessions' && (
        <PublicSessions eventData={eventData} option={urlOption} />
      )}
      {tabName === 'announcements' && (
        <Announcements
          eventData={eventData}
          setVerify={setVerify}
          canEdit={announcementsEdit}
        />
      )}
      {tabName === 'discussions' && <Discussions eventId={eventId} />}
    </Stack>
  );
};

export default Home;
