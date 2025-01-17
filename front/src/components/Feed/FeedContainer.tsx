import React from 'react';
import styled from 'styled-components';
import Feed from './Feed';
import { HabitatInfo } from '@src/types/Habitat';
import { flexBox, prettyScroll } from '@lib/styles/mixin';
import { Palette } from '@lib/styles/Palette';
import useScroll from '@hooks/useScroll';
import ScrollContainer from '@components/Feed/ScrollBoxContainer';
import ViewPort from '@components/Feed/ViewPort';
import useIntersectionObserver from '@hooks/useIntersectionObserver';
import { useElementRef } from '@hooks/useElementRef';
import useModal from '@common/Modal/useModal';
import DetailContainer from '@components/DetailModal/DetailContainer';
import useDetailFeed from '@components/Feed/useDetailFeed';
import Warning from '@common/Indicator/Warning';
import { useScrollState } from '@src/contexts/ScrollContext';
import Modal from '@common/Modal/Modal';
import SkeletonFeeds from '@components/Feed/SkeletonFeeds';

const FeedContainerDiv = styled.div<Partial<HabitatInfo>>`
  ${flexBox(null, null, 'column')};
  ${prettyScroll()};
  width: 500px;
  background-color: ${(props) => (props.color !== undefined ? props.color : Palette.PINK)};
  transition: background-color 0.5s ease-out 0s;
  height: 100%;
  margin: auto;
  padding: 10px 10px 10px 10px;
  box-sizing: border-box;
  gap: 20px;
  overflow-y: scroll;
  z-index: 10;
`;

interface FeedScrollBoxProps {
  habitatInfo: HabitatInfo | undefined | null;
  curHabitatId: number;
}

const callback: IntersectionObserverCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const target = entry.target.firstChild as HTMLImageElement;
      target.src = target.dataset.src as string;
      observer.unobserve(target);
    }
  });
};

const FeedContainer = ({ habitatInfo, curHabitatId }: FeedScrollBoxProps) => {
  const [observerElement, observerRef] = useElementRef();

  const { handleScroll } = useScroll(curHabitatId, observerElement);
  const { toggle } = useModal('/detail/:id');

  const lazy = useIntersectionObserver(callback, {
    root: observerElement,
    rootMargin: '300px 0px',
  });
  const { feeds, offset, height } = useScrollState();

  const detail = useDetailFeed();

  return (
    <FeedContainerDiv color={habitatInfo?.habitat.color} onScroll={handleScroll} ref={observerRef}>
      <ScrollContainer height={height}>
        <ViewPort offset={offset}>
          {habitatInfo ? (
            feeds.length ? (
              feeds.map((feed) => (
                <Feed
                  key={feed.post_id}
                  userId={feed.user_id}
                  feedId={feed.post_id}
                  nickname={feed.nickname}
                  imageURLs={feed.contents_url_array}
                  humanText={feed.human_content}
                  animalText={feed.animal_content}
                  createdTime={feed.created_at}
                  numOfHearts={feed.numOfHearts}
                  numOfComments={feed.numOfComments}
                  is_heart={feed.is_heart}
                  avatarImage={feed.user_image_url}
                  contentIds={feed.post_contents_ids}
                  lazy={lazy}
                />
              ))
            ) : (
              '첫 피드를 작성해보세요!'
            )
          ) : habitatInfo === undefined ? (
            <SkeletonFeeds />
          ) : (
            // <Loading width={'100px'} height={'100px'} />
            <Warning width={'100px'} height={'100px'} />
          )}
        </ViewPort>
      </ScrollContainer>
      <Modal routePath={'/detail/:id'} hide={toggle}>
        {detail && <DetailContainer detailFeed={detail} toggle={toggle} />}
      </Modal>
    </FeedContainerDiv>
  );
};

export default FeedContainer;
