import * as functions from 'firebase-functions';
import {getDocData} from './utils';
import {db} from './init';
import * as admin from 'firebase-admin';
import {sendEmail} from './send-email';

const MAIL_PROTOCOL = functions.config().mail.protocol;

const MAIL_DOMAIN =  functions.config().mail.domain;

/**
 *
 * whenever an answer gets created or edited, send an email to the creator of the question
 *
 **/

export const onAnswerSendEmailNotification = functions.firestore
  .document('schools/{tenantId}/courses/{courseId}/questions/{questionId}/answers/{answerId}')
  .onCreate(async (change, context) => {

    const tenantId = context.params.tenantId,
      courseId = context.params.courseId,
      questionId = context.params.questionId,
      answerId = context.params.answerId;

    const question = await getDocData(`schools/${tenantId}/courses/${courseId}/questions/${questionId}`);

    const user = await getDocData(`schools/${tenantId}/users/${question.userId}`);

    const course = await getDocData(`schools/${tenantId}/courses/${courseId}`);

    const lesson = await getDocData(`schools/${tenantId}/courses/${courseId}/lessons/${question.lessonId}`);

    const section = await getDocData(`schools/${tenantId}/courses/${courseId}/sections/${lesson.sectionId}`);

    const tenant = await getDocData(`tenants/${tenantId}`);

    const lessonUrl = `${MAIL_PROTOCOL}://${tenant.subDomain}.${MAIL_DOMAIN}/courses/${course.url}/${section.seqNo}/lessons/${lesson.seqNo}`;

    await sendEmail({
      from: "noreply@onlinecoursehost.com",
      to: user.email,
      subject: `New answer available: ${question.title}`,
      html: `<p>New answer available to "${question.title}"</p><br>
<a href="${lessonUrl}">Click Here to Read Answer</a>`
    });


  });

