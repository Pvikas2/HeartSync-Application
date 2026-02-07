// // Database Helper Functions
// // lib/db.js

// import { 
//   collection, 
//   addDoc, 
//   getDoc, 
//   doc, 
//   updateDoc,
//   serverTimestamp,
//   query,
//   where,
//   getDocs,
//   setDoc
// } from 'firebase/firestore';
// import { db } from './firebase';

// // Generate unique short ID
// export const generateUniqueId = () => {
//   return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
// };

// // Create new question set
// export const createQuestionSet = async (data) => {
//   try {
//     const uniqueId = generateUniqueId();
    
//     const questionSet = {
//       uniqueId,
//       creatorName: data.creatorName,
//       recipientName: data.recipientName,
//       questions: data.questions,
//       createdAt: serverTimestamp(),
//       answers: null,
//       isAnswered: false,
//     };
    
//     const docRef = await addDoc(collection(db, 'questionSets'), questionSet);
    
//     return {
//       success: true,
//       uniqueId,
//       docId: docRef.id,
//     };
//   } catch (error) {
//     console.error('Error creating question set:', error);
//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };


// // Get question set by unique ID
// export const getQuestionSet = async (uniqueId) => {
//   try {
//     const q = query(
//       collection(db, 'questionSets'), 
//       where('uniqueId', '==', uniqueId)
//     );
    
//     const querySnapshot = await getDocs(q);
    
//     if (querySnapshot.empty) {
//       return { success: false, error: 'Question set not found' };
//     }
    
//     const docData = querySnapshot.docs[0].data();
//     const docId = querySnapshot.docs[0].id;
    
//     return {
//       success: true,
//       data: {
//         id: docId,
//         ...docData,
//       },
//     };
//   } catch (error) {
//     console.error('Error getting question set:', error);
//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// // Submit answers
// export const submitAnswers = async (uniqueId, answerData) => {
//   try {
//     const q = query(
//       collection(db, 'questionSets'), 
//       where('uniqueId', '==', uniqueId)
//     );
    
//     const querySnapshot = await getDocs(q);
    
//     if (querySnapshot.empty) {
//       return { success: false, error: 'Question set not found' };
//     }
    
//     const docId = querySnapshot.docs[0].id;
//     const docRef = doc(db, 'questionSets', docId);
    
//     await updateDoc(docRef, {
//       answers: answerData,
//       isAnswered: true,
//       answeredAt: serverTimestamp(),
//     });
    
//     return { success: true };
//   } catch (error) {
//     console.error('Error submitting answers:', error);
//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// // Get creator's question sets with answers
// export const getCreatorQuestionSets = async (creatorName) => {
//   try {
//     const q = query(
//       collection(db, 'questionSets'),
//       where('creatorName', '==', creatorName),
//       where('isAnswered', '==', true)
//     );
    
//     const querySnapshot = await getDocs(q);
    
//     const questionSets = [];
//     querySnapshot.forEach((doc) => {
//       questionSets.push({
//         id: doc.id,
//         ...doc.data(),
//       });
//     });
    
//     return {
//       success: true,
//       data: questionSets,
//     };
//   } catch (error) {
//     console.error('Error getting creator question sets:', error);
//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// Database Helper Functions with Enhanced Error Handling
// lib/db.js

import { 
  collection, 
  addDoc, 
  getDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';

// Generate unique short ID
export const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
};

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    // Try to read from a test collection
    const testRef = collection(db, 'test');
    await getDocs(query(testRef));
    console.log('✅ Firebase connection successful!');
    return { success: true };
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return { 
      success: false, 
      error: error.message,
      code: error.code 
    };
  }
};

// Create new question set
export const createQuestionSet = async (data) => {
  console.log('📝 Creating question set...', data);
  
  try {
    // Validate data
    if (!data.creatorName || !data.recipientName || !data.questions || data.questions.length === 0) {
      throw new Error('Missing required fields: creatorName, recipientName, or questions');
    }

    // Check if db is initialized
    if (!db) {
      throw new Error('Firebase database not initialized. Please check your .env.local file.');
    }

    const uniqueId = generateUniqueId();
    console.log('🔑 Generated unique ID:', uniqueId);
    
    const questionSet = {
      uniqueId,
      creatorName: data.creatorName || 'Anonymous',
      recipientName: data.recipientName || 'Someone',
      questions: data.questions,
      createdAt: serverTimestamp(),
      answers: null,
      isAnswered: false,
    };

    console.log('💾 Saving to Firestore...');
    const docRef = await addDoc(collection(db, 'questionSets'), questionSet);
    console.log('✅ Question set created successfully! Doc ID:', docRef.id);
    
    return {
      success: true,
      uniqueId,
      docId: docRef.id,
    };
  } catch (error) {
    console.error('❌ Error creating question set:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Provide more specific error messages
    let userMessage = error.message;
    
    if (error.code === 'permission-denied') {
      userMessage = 'Permission denied. Please check Firestore security rules.';
    } else if (error.code === 'unavailable') {
      userMessage = 'Firebase is unavailable. Please check your internet connection.';
    } else if (error.message.includes('Firebase')) {
      userMessage = 'Firebase not configured. Please check your .env.local file.';
    }
    
    return {
      success: false,
      error: userMessage,
      details: error.message,
      code: error.code
    };
  }
};

// Get question set by unique ID
export const getQuestionSet = async (uniqueId) => {
  console.log('🔍 Fetching question set:', uniqueId);
  
  try {
    if (!uniqueId) {
      throw new Error('Unique ID is required');
    }

    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    const q = query(
      collection(db, 'questionSets'), 
      where('uniqueId', '==', uniqueId)
    );
    
    console.log('📡 Querying Firestore...');
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('❌ Question set not found');
      return { success: false, error: 'Question set not found' };
    }
    
    const docData = querySnapshot.docs[0].data();
    const docId = querySnapshot.docs[0].id;
    
    console.log('✅ Question set found!', docId);
    
    return {
      success: true,
      data: {
        id: docId,
        ...docData,
      },
    };
  } catch (error) {
    console.error('❌ Error getting question set:', error);
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

// Submit answers
export const submitAnswers = async (uniqueId, answerData) => {
  console.log('📤 Submitting answers for:', uniqueId);
  
  try {
    if (!uniqueId || !answerData) {
      throw new Error('Unique ID and answer data are required');
    }

    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    const q = query(
      collection(db, 'questionSets'), 
      where('uniqueId', '==', uniqueId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, error: 'Question set not found' };
    }
    
    const docId = querySnapshot.docs[0].id;
    const docRef = doc(db, 'questionSets', docId);
    
    console.log('💾 Updating document...');
    await updateDoc(docRef, {
      answers: answerData,
      isAnswered: true,
      answeredAt: serverTimestamp(),
    });
    
    console.log('✅ Answers submitted successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error submitting answers:', error);
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

// Get creator's question sets with answers
export const getCreatorQuestionSets = async (creatorName) => {
  console.log('🔍 Fetching question sets for:', creatorName);
  
  try {
    if (!creatorName) {
      throw new Error('Creator name is required');
    }

    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    const q = query(
      collection(db, 'questionSets'),
      where('creatorName', '==', creatorName),
      where('isAnswered', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    const questionSets = [];
    querySnapshot.forEach((doc) => {
      questionSets.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    console.log(`✅ Found ${questionSets.length} question sets`);
    
    return {
      success: true,
      data: questionSets,
    };
  } catch (error) {
    console.error('❌ Error getting creator question sets:', error);
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};