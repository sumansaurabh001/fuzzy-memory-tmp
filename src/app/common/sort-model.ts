import {CourseSection} from '../models/course-section.model';
import {Lesson} from '../models/lesson.model';



export function sortSectionsBySeqNo(sections: CourseSection[]) {
  return sections.sort(compareSections);
}

export function compareSections(s1:CourseSection, s2: CourseSection) {
  return s1.seqNo - s2.seqNo;
}


export function sortLessonsBySectionAndSeqNo(lessons: Lesson[], sections: CourseSection[])  {

  const sortedLessons = lessons.sort((l1, l2) => {

    const s1 = sections.find(s => s.id == l1.sectionId),
      s2 = sections.find(s => s.id == l2.sectionId);

    const sectionCompare = s1.seqNo - s2.seqNo;

    if (sectionCompare != 0) {
      return sectionCompare;
    }
    else {
      return l1.seqNo - l2.seqNo;
    }

  });

  return lessons;
}
