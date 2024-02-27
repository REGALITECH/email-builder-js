import React from 'react';
import { z } from 'zod';

import { TEditorBlock } from '../../editor/core';
import { useCurrentBlockId } from '../../editor/EditorBlock';
import { useEditorState } from '../../editor/EditorContext';
import ReaderBlock from '../../reader/ReaderBlock';
import EditorChildrenIds from '../helpers/EditorChildrenIds';

import { ContainerPropsSchema } from './ContainerPropsSchema';

export type ContainerProps = z.infer<typeof ContainerPropsSchema>;

export function Container({ props: { childrenIds } }: ContainerProps) {
  return (
    <>
      {childrenIds.map((childId) => (
        <ReaderBlock key={childId} id={childId} />
      ))}
    </>
  );
}

export function EditorContainer({ props: { childrenIds } }: ContainerProps) {
  const [{ document }, setEditorState] = useEditorState();
  const blockId = useCurrentBlockId();

  const insertBlock = (blockConfiguration: TEditorBlock, i: number | null) => {
    const id = `block-${Date.now()}`;
    let nChildrenIds: string[];
    if (i === null) {
      nChildrenIds = [...childrenIds, id];
    } else {
      nChildrenIds = [...childrenIds.slice(0, i), id, ...childrenIds.slice(i)];
    }
    setEditorState({
      selectedBlockId: id,
      document: {
        ...document,
        [id]: blockConfiguration,
        [blockId]: {
          type: 'Container',
          data: {
            ...document[blockId].data,
            props: { childrenIds: nChildrenIds },
          },
        } as TEditorBlock,
      },
    });
    setEditorState({});
  };

  return <EditorChildrenIds childrenIds={childrenIds} insertBlock={insertBlock} />;
}