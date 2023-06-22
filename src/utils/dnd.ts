import { refreshPage } from '~/routes'
import { DndBaseType } from '~/entities/dnd'

const reorderSameDestination = async <T extends DndBaseType>(
  draggedId: string,
  droppedId: string,
  draggedIndex: number,
  droppedIndex: number,
  documents: T[],
  updateDocument: (id: string, document: Omit<T, 'id' | 'updatedAt'>) => Promise<void>
) => {
  const draggedDocument = documents[draggedIndex]
  const droppedDocument = documents[droppedIndex]

  //MEMO: form lower to higher order
  if (draggedDocument.order < droppedDocument.order) {
    for (let i = draggedIndex + 1; i < droppedIndex; i++) {
      documents[i].order = documents[i].order - 1
      await updateDocument(documents[i].id, documents[i])
    }

    documents[draggedIndex].order = droppedDocument.order
    await updateDocument(draggedId, documents[draggedIndex])
    documents[droppedIndex].order = droppedDocument.order - 1
    await updateDocument(droppedId, documents[droppedIndex])

    //MEMO: form higher to lower order
  } else if (draggedDocument.order > droppedDocument.order) {
    for (let i = draggedIndex - 1; i > droppedIndex; i--) {
      documents[i].order = documents[i].order + 1
      await updateDocument(documents[i].id, documents[i])
    }

    documents[draggedIndex].order = droppedDocument.order
    await updateDocument(draggedId, documents[draggedIndex])
    documents[droppedIndex].order = draggedDocument.order + 1
    await updateDocument(droppedId, documents[droppedIndex])
  }
}

const reorderDifferentNonEmptyDestination = async <T extends DndBaseType>(
  draggedIndex: number,
  droppedIndex: number,
  documents: T[],
  collectionIdPropertyInDocument: string,
  updateDocument: (id: string, document: Omit<T, 'id' | 'updatedAt'>) => Promise<void>
) => {
  type UpdatedT = Omit<T, 'id' | 'updatedAt'>

  const draggedDocument = documents[draggedIndex]
  const droppedDocument = documents[droppedIndex]

  //documents with higher order than the dragged document in the collection of dragged documents
  const higherOrderThanDraggedDestinationDocumentsDocument = documents.filter(
    (document) => document[collectionIdPropertyInDocument][0] === draggedDocument[collectionIdPropertyInDocument][0] && document.order > draggedDocument.order
  )

  //After being dragged, the order of the higher order document in the collection from which it was dragged is lowered
  higherOrderThanDraggedDestinationDocumentsDocument.forEach(async (document) => {
    const updatedDocument: UpdatedT = {
      ...document,
      order: document.order - 1,
    }
    await updateDocument(document.id, updatedDocument)
  })

  const higherOrderThanDroppedDocumentDocuments = documents.filter(
    (document) =>
      document[collectionIdPropertyInDocument][0] === (droppedDocument as unknown)?.[collectionIdPropertyInDocument][0] &&
      document.order >= droppedDocument.order
  )

  higherOrderThanDroppedDocumentDocuments.forEach(async (document) => {
    const updatedDocument = {
      ...document,
      order: document.order + 1,
    }
    await updateDocument(document.id, updatedDocument)
  })

  const updatedDraggedDocument = {
    ...draggedDocument,
    order: droppedDocument.order,
    [collectionIdPropertyInDocument]: (droppedDocument as unknown)?.[collectionIdPropertyInDocument],
  }
  await updateDocument(draggedDocument.id, updatedDraggedDocument)
}

const reorderDifferentEmptyDestination = async <T extends DndBaseType>(
  draggedIndex: number,
  droppedCollectionId: string,
  documents: T[],
  collectionIdPropertyInDocument: string,
  updateDocument: (id: string, document: Omit<T, 'id' | 'updatedAt'>) => Promise<void>
) => {
  type UpdatedT = Omit<T, 'id' | 'updatedAt'>

  const draggedDocument = documents[draggedIndex]

  const higherOrderThanDraggedDocumentDocuments = documents.filter(
    (document) => document[collectionIdPropertyInDocument][0] === draggedDocument[collectionIdPropertyInDocument][0] && document.order > draggedDocument.order
  )

  higherOrderThanDraggedDocumentDocuments.forEach(async (document) => {
    const updatedDocument: UpdatedT = {
      ...document,
      order: document.order - 1,
    }
    await updateDocument(document.id, updatedDocument)
  })

  const updatedDocument: UpdatedT = {
    ...draggedDocument,
    groupIDs: [droppedCollectionId],
    order: 0,
  }
  await updateDocument(draggedDocument.id, updatedDocument)
}

export const useDnd = <T extends DndBaseType, U extends DndBaseType>(
  documentClassName: string,
  collectionClassName: string,
  documents: T[],
  collections: U[],
  collectionIdPropertyInDocument: string,
  updateDocument: (id: string, updatedDocument: Omit<T, 'id' | 'updatedAt'>) => Promise<void>,
  updateCollection: (id: string, updatedCollection: Omit<U, 'id' | 'updatedAt'>) => Promise<void>
) => {
  const documentElements = document.querySelectorAll(`.${documentClassName}`)
  const collectionElements = document.querySelectorAll(`.${collectionClassName}`)

  //MEMO: Task side
  documentElements.forEach((documentElement: HTMLDivElement) => {
    documentElement.draggable = true
    documentElement.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', documentElement.id)
      event.stopPropagation()
    })
    documentElement.addEventListener('dragover', (event) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    })

    // Event at end of drag
    documentElement.addEventListener('dragend', (event) => {
      event.dataTransfer.clearData()
    })
    documentElement.addEventListener('drop', async (event) => {
      event.preventDefault()

      const draggedDocumentId = event.dataTransfer.getData('text/plain')
      const droppedDocumentId = documentElement.id

      const draggedDocumentIndex = documents.map((document) => document.id).indexOf(draggedDocumentId)
      const droppedDocumentIndex = documents.map((document) => document.id).indexOf(droppedDocumentId)

      const draggedDocument = documents[draggedDocumentIndex]
      const droppedDocument = documents[droppedDocumentIndex]

      //MEMO: task ->task in the different collection
      if (draggedDocument[collectionIdPropertyInDocument][0] !== droppedDocument[collectionIdPropertyInDocument][0]) {
        reorderDifferentNonEmptyDestination(draggedDocumentIndex, droppedDocumentIndex, documents, collectionIdPropertyInDocument, updateDocument)
        refreshPage()
        return
      }

      //MEMO: task -> task same in the same collection
      await reorderSameDestination(draggedDocumentId, droppedDocumentId, draggedDocumentIndex, droppedDocumentIndex, documents, updateDocument)
      refreshPage()
    })
  })

  //MEMO: Group side
  collectionElements.forEach((collectionElement: HTMLDivElement) => {
    collectionElement.draggable = true

    collectionElement.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', collectionElement.id)
      event.stopPropagation()
    })

    collectionElement.addEventListener('dragover', (event) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    })

    collectionElement.addEventListener('dragend', (event) => {
      event.dataTransfer.clearData()
    })

    collectionElement.addEventListener('drop', async (event) => {
      event.preventDefault()

      const draggedElementId = event.dataTransfer.getData('text/plain')

      const droppedCollectionId = collectionElement.id

      const draggedCollectionIndex = collections.map((collection) => collection.id).indexOf(draggedElementId)
      const droppedCollectionIndex = collections.map((collection) => collection.id).indexOf(droppedCollectionId)

      const draggedDocumentIndex = documents.map((document) => document.id).indexOf(draggedElementId)
      const isEmptyDroppedCollection = documents.map((document) => document[collectionIdPropertyInDocument][0]).indexOf(droppedCollectionId) === -1

      //MEMO: task -> empty collection
      if (draggedDocumentIndex !== -1 && isEmptyDroppedCollection) {
        const draggedDocumentId = documents.map((document) => document.id).indexOf(draggedElementId)

        await reorderDifferentEmptyDestination(draggedDocumentId, droppedCollectionId, documents, collectionIdPropertyInDocument, updateDocument)
        refreshPage()
        return
      }

      //MEMO: task -> task in the different collection
      //this action is executed at the task side
      if (draggedDocumentIndex !== -1 && !isEmptyDroppedCollection) {
        return
      }

      //MEMO: group -> group
      await reorderSameDestination(draggedElementId, droppedCollectionId, draggedCollectionIndex, droppedCollectionIndex, collections, updateCollection)
      refreshPage()
    })
  })
}
