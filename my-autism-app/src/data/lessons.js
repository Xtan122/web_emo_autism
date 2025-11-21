// Dữ liệu bài học giả lập
export const lessonData = {
  // Cấp độ 1
  1: {
    flashcard: [
      {
        id: 1,
        question: "Bạn nhỏ này đang cảm thấy gì?",
        image: "https://img.freepik.com/free-photo/portrait-young-happy-boy-smiling_23-2148156759.jpg", // Ảnh Vui
        options: ["Vui vẻ", "Buồn bã"],
        correct: "Vui vẻ"
      },
      {
        id: 2,
        question: "Khuôn mặt này thể hiện điều gì?",
        image: "https://img.freepik.com/free-photo/sad-boy-looking-down_23-2148156754.jpg", // Ảnh Buồn
        options: ["Vui vẻ", "Buồn bã"],
        correct: "Buồn bã"
      },
      {
        id: 3,
        question: "Bạn ấy đang rất...?",
        image: "https://img.freepik.com/free-photo/angry-boy-screaming_23-2148156744.jpg", // Ảnh Giận
        options: ["Tức giận", "Vui vẻ"],
        correct: "Tức giận"
      }
    ],

    matching: [
      { id: 1, emotion: 'happy', image: '/images/cards/happy-boy.png' }, // Bạn cần thay ảnh thật
      { id: 2, emotion: 'happy', image: '/images/cards/happy-girl.png' }, // Cặp với hình trên
      { id: 3, emotion: 'sad', image: '/images/cards/sad-boy.png' },
      { id: 4, emotion: 'sad', image: '/images/cards/sad-girl.png' }
    ],

    context: [
      {
        id: 1,
        type: "story",
        image: "https://img.freepik.com/free-vector/happy-boy-opening-birthday-gifts_1308-133444.jpg",
        story: "Hôm nay sinh nhật Nam, mẹ tặng cho Nam một món đồ chơi mới.", // Tình huống
        question: "Nam cảm thấy thế nào?",
        options: ["Vui vẻ", "Tức giận"],
        correct: "Vui vẻ"
      },
      {
        id: 2,
        type: "story",
        image: "https://img.freepik.com/free-vector/sad-boy-crying-because-ice-cream-fell-down_1308-133823.jpg",
        story: "Ôi không! Cây kem của bạn bị rơi xuống đất mất rồi.",
        question: "Bạn ấy sẽ cảm thấy sao nhỉ?",
        options: ["Vui vẻ", "Buồn bã"],
        correct: "Buồn bã"
      }
    ],

    ai: [
      {
        id: 1,
        targetEmotion: 'Vui vẻ',
        instruction: "Con hãy CƯỜI thật tươi giống bạn nhé!",
        // Đây là ảnh bìa video (hoặc link video thật nếu bạn có)
        videoThumbnail: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    ],
  },
  
  2: {
    flashcard: [
      {
        id: 1,
        question: "Bạn nhỏ này đang cảm thấy gì?",
        image: "https://img.freepik.com/free-photo/portrait-young-happy-boy-smiling_23-2148156759.jpg", // Ảnh Vui
        options: ["Vui vẻ", "Buồn bã"],
        correct: "Vui vẻ"
      },
      {
        id: 2,
        question: "Khuôn mặt này thể hiện điều gì?",
        image: "https://img.freepik.com/free-photo/sad-boy-looking-down_23-2148156754.jpg", // Ảnh Buồn
        options: ["Vui vẻ", "Buồn bã"],
        correct: "Buồn bã"
      },
      {
        id: 3,
        question: "Bạn ấy đang rất...?",
        image: "https://img.freepik.com/free-photo/angry-boy-screaming_23-2148156744.jpg", // Ảnh Giận
        options: ["Tức giận", "Vui vẻ"],
        correct: "Tức giận"
      }
    ],

    matching: [
      { id: 1, emotion: 'happy', image: '/images/cards/happy-boy.png' }, // Bạn cần thay ảnh thật
      { id: 2, emotion: 'happy', image: '/images/cards/happy-girl.png' }, // Cặp với hình trên
      { id: 3, emotion: 'sad', image: '/images/cards/sad-boy.png' },
      { id: 4, emotion: 'sad', image: '/images/cards/sad-girl.png' }
    ],

    context: [
      {
        id: 1,
        type: "story",
        image: "https://img.freepik.com/free-vector/happy-boy-opening-birthday-gifts_1308-133444.jpg",
        story: "Hôm nay sinh nhật Nam, mẹ tặng cho Nam một món đồ chơi mới.", // Tình huống
        question: "Nam cảm thấy thế nào?",
        options: ["Vui vẻ", "Tức giận"],
        correct: "Vui vẻ"
      },
      {
        id: 2,
        type: "story",
        image: "https://img.freepik.com/free-vector/sad-boy-crying-because-ice-cream-fell-down_1308-133823.jpg",
        story: "Ôi không! Cây kem của bạn bị rơi xuống đất mất rồi.",
        question: "Bạn ấy sẽ cảm thấy sao nhỉ?",
        options: ["Vui vẻ", "Buồn bã"],
        correct: "Buồn bã"
      }
    ],

    ai: [
      {
        id: 1,
        targetEmotion: 'Vui vẻ',
        instruction: "Con hãy CƯỜI thật tươi giống bạn nhé!",
        // Đây là ảnh bìa video (hoặc link video thật nếu bạn có)
        videoThumbnail: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    ]
  },

  3: {
    flashcard: [
      {
        id: 1,
        question: "Bạn nhỏ này đang cảm thấy gì?",
        image: "https://img.freepik.com/free-photo/portrait-young-happy-boy-smiling_23-2148156759.jpg", // Ảnh Vui
        options: ["Vui vẻ", "Buồn bã"],
        correct: "Vui vẻ"
      },
      {
        id: 2,
        question: "Khuôn mặt này thể hiện điều gì?",
        image: "https://img.freepik.com/free-photo/sad-boy-looking-down_23-2148156754.jpg", // Ảnh Buồn
        options: ["Vui vẻ", "Buồn bã"],
        correct: "Buồn bã"
      },
      {
        id: 3,
        question: "Bạn ấy đang rất...?",
        image: "https://img.freepik.com/free-photo/angry-boy-screaming_23-2148156744.jpg", // Ảnh Giận
        options: ["Tức giận", "Vui vẻ"],
        correct: "Tức giận"
      }
    ],

    matching: [
      { id: 1, emotion: 'happy', image: '/images/cards/happy-boy.png' }, // Bạn cần thay ảnh thật
      { id: 2, emotion: 'happy', image: '/images/cards/happy-girl.png' }, // Cặp với hình trên
      { id: 3, emotion: 'sad', image: '/images/cards/sad-boy.png' },
      { id: 4, emotion: 'sad', image: '/images/cards/sad-girl.png' }
    ],

    context: [
      {
        id: 1,
        type: "story",
        image: "https://img.freepik.com/free-vector/happy-boy-opening-birthday-gifts_1308-133444.jpg",
        story: "Hôm nay sinh nhật Nam, mẹ tặng cho Nam một món đồ chơi mới.", // Tình huống
        question: "Nam cảm thấy thế nào?",
        options: ["Vui vẻ", "Tức giận"],
        correct: "Vui vẻ"
      },
      {
        id: 2,
        type: "story",
        image: "https://img.freepik.com/free-vector/sad-boy-crying-because-ice-cream-fell-down_1308-133823.jpg",
        story: "Ôi không! Cây kem của bạn bị rơi xuống đất mất rồi.",
        question: "Bạn ấy sẽ cảm thấy sao nhỉ?",
        options: ["Vui vẻ", "Buồn bã"],
        correct: "Buồn bã"
      }
    ],

    ai: [
      {
        id: 1,
        targetEmotion: 'Vui vẻ',
        instruction: "Con hãy CƯỜI thật tươi giống bạn nhé!",
        // Đây là ảnh bìa video (hoặc link video thật nếu bạn có)
        videoThumbnail: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    ]
  }


};