function getRandomTopic (firebase, type, reverse) {
  return firebase.firestore().collection('topics')
    .where('type', '==', type)
    .where('random', !!reverse ? '>=' : '<=', Math.random())
    .orderBy('random')
    .limit(1)
    .get()
    .then(snapshot => 
      snapshot.size === 1 
        ? snapshot.docs[0].data()
        : getRandomTopic(firebase, type, !reverse)
    )
}
  
export default getRandomTopic