import {CourseSection} from '../models/course-section.model';
import {Lesson} from '../models/lesson.model';
import {Course} from '../models/course.model';





export function sortSectionsBySeqNo(sections: CourseSection[]) {
  return sections.sort(compareSections);
}

export function compareCourses(c1:Course, c2: Course) {
  return c1.seqNo - c2.seqNo;
}

export function compareSections(s1:CourseSection, s2: CourseSection) {
  return s1.seqNo - s2.seqNo;
}

export function compareLessons(l1:Lesson, l2:Lesson) {

  let compareSections = 0;

  if (l1.sectionId < l2.sectionId) {
    compareSections = -1;
  }

  if (l1.sectionId > l2.sectionId) {
    compareSections = 1;
  }

  if (compareSections != 0) {
    return compareSections;
  }

  return l1.seqNo - l2.seqNo;

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

  return sortedLessons;
}
