from ssl import VerifyFlags
from django.contrib import admin
from django.db import models
from ckeditor.fields import RichTextField
import datetime
from django.contrib.auth.models import AbstractUser

Gender = (
    ('male', 'Male'),
    ('female', 'Female')
)

class CustomUser(AbstractUser):
    blocked = models.BooleanField(default=False)
    avatar = models.CharField(blank=True, null=True, max_length=600,default='{"accessory":"shades","body":"chest","circleColor":"blue","clothing":"tankTop","clothingColor":"red","eyebrows":"raised","eyes":"simple","faceMask":false,"faceMaskColor":"white","facialHair":"none","graphic":"none","hair":"none","hairColor":"pink","hat":"none","hatColor":"blue","lashes":false,"lipColor":"green","mask":true,"mouth":"serious","skinTone":"light"}')
    bio = models.CharField(blank=True, null=True, max_length=255)
    birthday_date = models.DateField(blank=True, null=True)
    gender = models.CharField(blank=True, null=True,max_length=7, choices=Gender)
    q_coins = models.IntegerField(default=200)

    def __str__(self):
        return str(self.email)


MESSAGES_CHOICES = (
    ('info', 'info'),
    ('congrat', 'congrat'),
    ('warning', 'warning'),
)

class Messages(models.Model):
    user = models.ForeignKey(CustomUser, related_name='user_messages',
                             blank=True, null=True, on_delete=models.CASCADE)
    message = models.CharField(max_length=255, blank=False, null=True)
    type = models.CharField(
        max_length=255, choices=MESSAGES_CHOICES, blank=False, null=True)
    has_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user)

class Document(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=80, null=False,
                             blank=False, default=None)
    note = models.TextField(blank=True, null=True, default=None)

    def __str__(self):
        return str(self.title)

class Document_Admin(admin.ModelAdmin):
    list_display = ('title', 'note')
    search_fields = ['id', 'title', 'note']

class Categories(models.Model):
    id = models.AutoField(primary_key=True)
    title_english = models.CharField(
        max_length=80, null=False, blank=False, default=None)
    title_persian = models.CharField(
        max_length=80, null=False, blank=False, default=None)
    monthly_views = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    publish = models.DateField(default=datetime.date.today)

    def __str__(self):
        return str(self.title_english)

class SubCategories(models.Model):
    id = models.AutoField(primary_key=True)
    public = models.BooleanField(default=True)
    categoryKey = models.ForeignKey(
        Categories, related_name='categoryKey_subCategory', on_delete=models.PROTECT, blank=True, null=True)
    subCategory = models.CharField(
        max_length=200, null=False, blank=False, default=None)
    title = models.CharField(max_length=80, null=False,
                             blank=False, default=None)
    thumbnail = models.ImageField(
        upload_to='Thn-Category', null=True, blank=True, default='NotExist.jpg')
    background = models.ImageField(
        upload_to='Sub-Category', default='NotExist.jpg', help_text='background of choosing quizzes')
    monthly_views = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    publish = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return str(self.subCategory)

class Quizzes(models.Model):
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=4, default='quiz')
    public = models.BooleanField(default=True)
    categoryKey = models.ForeignKey(
        Categories, related_name='categoryKey_quizzes', on_delete=models.PROTECT, blank=True, null=True)
    subCategory = models.CharField(
        max_length=100, null=False, blank=False, default=None)
    slug = models.CharField(max_length=80, null=False,
                            blank=False, default=None)  # unique=True
    title = models.CharField(max_length=200, null=False,
                             blank=False, default=None)
    tags = models.CharField(max_length=200, null=False,
                            blank=False, default='کوییز')
    monthly_views = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    thumbnail = models.ImageField(
        upload_to='QuizzesThumbnail', default='NotExist.jpg', help_text='thumbnail of quiz')
    background = models.ImageField(
        upload_to='QuizzesBackground', default='NotExist.jpg', help_text='background of playing quiz')
    question_background = models.CharField(max_length=7, default="#911a1a")
    fan_name = models.CharField(
        max_length=100, null=False, blank=False, default=None)
    GIF20 = models.ImageField(
        upload_to='Answer-And-Result-ImGIf/', default='NotExist.jpg')
    GIF40 = models.ImageField(
        upload_to='Answer-And-Result-ImGIf/', default='NotExist.jpg')
    GIF60 = models.ImageField(
        upload_to='Answer-And-Result-ImGIf/', default='NotExist.jpg')
    GIF80 = models.ImageField(
        upload_to='Answer-And-Result-ImGIf/', default='NotExist.jpg')
    GIF100 = models.ImageField(
        upload_to='Answer-And-Result-ImGIf/', default='NotExist.jpg')
    created_by = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, related_name='user_quiz_id', blank=False, null=True)
    publish = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return str(self.title)

    def __unicode__(self):
        return 'test'

class Quizzes_V2(models.Model):
    id = models.AutoField(primary_key=True)
    public = models.BooleanField(default=True)
    categoryKey = models.ForeignKey(
        Categories, related_name='categoryKey_quizzesV2', on_delete=models.PROTECT, blank=True, null=True)
    slug = models.CharField(max_length=80, null=False,
                            blank=False, default=None)  # unique=True
    title = models.CharField(max_length=200, null=False,
                             blank=False, default=None)
    tags = models.CharField(max_length=200, null=False,
                            blank=False, default='کوییز')
    monthly_views = models.IntegerField(default=0)
    fees = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    thumbnail = models.ImageField(
        upload_to='QuizzesV2Thumbnail', default='NotExist.jpg', help_text='thumbnail of quiz')
    theme = models.CharField(max_length=7, default="#911a1a")
    GIF_awful = models.ImageField(
        upload_to='Answer-And-Result-ImGIf-v2/', default='NotExist.jpg')
    GIF_bad = models.ImageField(
        upload_to='Answer-And-Result-ImGIf-v2/', default='NotExist.jpg')
    GIF_ok = models.ImageField(
        upload_to='Answer-And-Result-ImGIf-v2/', default='NotExist.jpg')
    GIF_good = models.ImageField(
        upload_to='Answer-And-Result-ImGIf-v2/', default='NotExist.jpg')
    GIF_great = models.ImageField(
        upload_to='Answer-And-Result-ImGIf-v2/', default='NotExist.jpg')
    created_by = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, related_name='user_quizV2_id', blank=False, null=True)
    publish = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return str(self.title)

    def __unicode__(self):
        return 'test'

class Quizzes_Pointy(models.Model):
    id = models.AutoField(primary_key=True)
    public = models.BooleanField(default=True)
    categoryKey = models.ForeignKey(
        Categories, related_name='categoryKey_quizzesPointy', on_delete=models.PROTECT, blank=True, null=True)
    subCategory = models.CharField(
        max_length=100, null=False, blank=False, default=None)
    slug = models.CharField(max_length=80, null=False,
                            blank=False, default=None)  # unique=True
    title = models.CharField(max_length=200, null=False,
                             blank=False, default=None)
    tags = models.CharField(max_length=200, null=False,
                            blank=False, default='کوییز')
    monthly_views = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    thumbnail = models.ImageField(
        upload_to='QuizzesThumbnail', default='NotExist.jpg', help_text='thumbnail of quiz')
    background = models.ImageField(
        upload_to='Quizzes', default='NotExist.jpg', help_text='background of playing quiz')
    publish = models.DateTimeField(default=datetime.datetime.now)
    created_by = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, related_name='user_test_id', blank=False, null=True)
    question_background = models.CharField(max_length=7, default="#911a1a")
    type = models.CharField(max_length=4, default='test')
    result_upTo_1st = models.IntegerField(
        null=False, blank=False, default=None)
    result_upTo_2nd = models.IntegerField(
        null=False, blank=False, default=None)
    result_upTo_3rd = models.IntegerField(blank=True, null=True, default=None)
    result_upTo_4th = models.IntegerField(blank=True, null=True, default=None)
    result_upTo_5th = models.IntegerField(blank=True, null=True, default=None)
    result_upTo_6th = models.IntegerField(blank=True, null=True, default=None)
    result_upTo_7th = models.IntegerField(blank=True, null=True, default=None)
    result_upTo_8th = models.IntegerField(blank=True, null=True, default=None)
    result_upTo_9th = models.IntegerField(blank=True, null=True, default=None)
    result_upTo_10th = models.IntegerField(blank=True, null=True, default=None)

    result_title_1st = models.CharField(
        max_length=200, null=False, blank=False, default=None)
    result_title_2nd = models.CharField(
        max_length=200, null=False, blank=False, default=None)
    result_title_3rd = models.CharField(
        max_length=200, blank=True, null=True, default=None)
    result_title_4th = models.CharField(
        max_length=200, blank=True, null=True, default=None)
    result_title_5th = models.CharField(
        max_length=200, blank=True, null=True, default=None)
    result_title_6th = models.CharField(
        max_length=200, blank=True, null=True, default=None)
    result_title_7th = models.CharField(
        max_length=200, blank=True, null=True, default=None)
    result_title_8th = models.CharField(
        max_length=200, blank=True, null=True, default=None)
    result_title_9th = models.CharField(
        max_length=200, blank=True, null=True, default=None)
    result_title_10th = models.CharField(
        max_length=200, blank=True, null=True, default=None)

    result_text_1st = RichTextField(blank=True, null=True, default=None)
    result_text_2nd = RichTextField(blank=True, null=True, default=None)
    result_text_3rd = RichTextField(blank=True, null=True, default=None)
    result_text_4th = RichTextField(blank=True, null=True, default=None)
    result_text_5th = RichTextField(blank=True, null=True, default=None)
    result_text_6th = RichTextField(blank=True, null=True, default=None)
    result_text_7th = RichTextField(blank=True, null=True, default=None)
    result_text_8th = RichTextField(blank=True, null=True, default=None)
    result_text_9th = RichTextField(blank=True, null=True, default=None)
    result_text_10th = RichTextField(blank=True, null=True, default=None)

    result_img_1st = models.ImageField(
        upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')
    result_img_2nd = models.ImageField(
        upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')
    result_img_3rd = models.ImageField(
        upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')
    result_img_4th = models.ImageField(
        upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')
    result_img_5th = models.ImageField(
        upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')
    result_img_6th = models.ImageField(
        upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')
    result_img_7th = models.ImageField(
        upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')
    result_img_8th = models.ImageField(
        upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')
    result_img_9th = models.ImageField(
        upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')
    result_img_10th = models.ImageField(
        upload_to='Pointy-Quiz-Result', null=True, blank=True, default='NotExist.jpg')

    def __str__(self):
        return str(self.title)

class Questions(models.Model):
    id = models.AutoField(primary_key=True)
    quizKey = models.ForeignKey(
        Quizzes, related_name='quizKey_questions', on_delete=models.CASCADE, blank=True, null=True)
    question = models.CharField(max_length=150, blank=True, default=None)
    question_img = models.ImageField(
        upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_1st = models.CharField(max_length=100, blank=True, default=None)
    option_2nd = models.CharField(max_length=100, blank=True, default=None)
    option_3rd = models.CharField(max_length=100, blank=True, default=None)
    option_4th = models.CharField(max_length=100, blank=True, default=None)
    option_img_1st = models.ImageField(
        upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_2nd = models.ImageField(
        upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_3rd = models.ImageField(
        upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_4th = models.ImageField(
        upload_to='Question-Option-Imgs', default='NotExist.jpg')
    answer = models.IntegerField(blank=False, default=None)
    answer_imGif = models.ImageField(
        upload_to='Answer-And-Result-ImGIf', default='NotExist.jpg')
    answer_text = models.CharField(max_length=200, blank=True, default=None)

    def __str__(self):
        return str(self.quizKey)

    def __unicode__(self):
        return 'test'

class Questions_V2(models.Model):
    id = models.AutoField(primary_key=True)
    public = models.BooleanField(default=True)
    submitter_id = models.ForeignKey(CustomUser, related_name='user_questionV2_id', blank=False, null=True, on_delete=models.SET_NULL)
    date_submitted = models.DateTimeField(blank=True, null=True, default=datetime.datetime.now)
    quizKey = models.ForeignKey(Quizzes_V2, related_name='quizKey_questions_V2',
                                on_delete=models.CASCADE, blank=True, null=True)
    question = models.CharField(max_length=150, blank=True, default=None)
    question_img = models.ImageField(upload_to='Question-V2-Option-Imgs', default='NotExist.jpg')
    option_1st = models.CharField(max_length=100, blank=False, null=False, default=None)
    option_2nd = models.CharField(max_length=100, blank=False, null=False, default=None)
    option_3rd = models.CharField(max_length=100, blank=False, null=False, default=None)
    option_4th = models.CharField(max_length=100, blank=False, null=False, default=None)
    option_img_1st = models.ImageField(
        upload_to='Question-V2-Option-Imgs', default='NotExist.jpg')
    option_img_2nd = models.ImageField(
        upload_to='Question-V2-Option-Imgs', default='NotExist.jpg')
    option_img_3rd = models.ImageField(
        upload_to='Question-V2-Option-Imgs', default='NotExist.jpg')
    option_img_4th = models.ImageField(
        upload_to='Question-V2-Option-Imgs', default='NotExist.jpg')

    def __str__(self):
        return str(self.question)
    
class Answer_V2(models.Model):
    id = models.AutoField(primary_key=True)
    questionKey = models.ForeignKey(Questions_V2, related_name='questionKey_answer_V2', on_delete=models.CASCADE, blank=False, null=False)
    answer = models.IntegerField(blank=False, default=None)
    answer_imGif = models.ImageField(upload_to='Answer-And-Result-ImGIf-V2', default='NotExist.jpg')
    answer_text = models.CharField(max_length=200, blank=True, default=None)
    
    def __str__(self):
        return str({
            'answer': self.answer,
            'answer_imGif': self.answer_imGif,
            'answer_text': self.answer_text
        })

class Pointy_Questions(models.Model):
    id = models.AutoField(primary_key=True)
    quizKey = models.ForeignKey(Quizzes_Pointy, related_name='quizKey_pointyQuestions',
                                on_delete=models.CASCADE, blank=True, null=True)
    question = models.CharField(
        max_length=150, null=True, blank=True, default=None)
    question_img = models.ImageField(
        upload_to='Question-Option-Imgs', default='NotExist.jpg')

    option_1st = models.CharField(max_length=100, blank=True)
    option_2nd = models.CharField(max_length=100, blank=True)
    option_3rd = models.CharField(max_length=100, blank=True)
    option_4th = models.CharField(max_length=100, blank=True)
    option_5th = models.CharField(max_length=100, blank=True)
    option_6th = models.CharField(max_length=100, blank=True)
    option_7th = models.CharField(max_length=100, blank=True)
    option_8th = models.CharField(max_length=100, blank=True)
    option_9th = models.CharField(max_length=100, blank=True)
    option_10th = models.CharField(max_length=100, blank=True)

    option_img_1st = models.ImageField(
        upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_2nd = models.ImageField(
        upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_3rd = models.ImageField(
        upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_4th = models.ImageField(
        upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_5th = models.ImageField(
        upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_6th = models.ImageField(
        upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_7th = models.ImageField(
        upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_8th = models.ImageField(
        upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_9th = models.ImageField(
        upload_to='Question-Option-Imgs', default='NotExist.jpg')
    option_img_10th = models.ImageField(
        upload_to='Question-Option-Imgs', default='NotExist.jpg')

    option_point_1st = models.IntegerField(blank=True, default=1)
    option_point_2nd = models.IntegerField(blank=True, default=2)
    option_point_3rd = models.IntegerField(blank=True, default=3)
    option_point_4th = models.IntegerField(blank=True, default=4)
    option_point_5th = models.IntegerField(blank=True, default=5)
    option_point_6th = models.IntegerField(blank=True, default=6)
    option_point_7th = models.IntegerField(blank=True, default=7)
    option_point_8th = models.IntegerField(blank=True, default=8)
    option_point_9th = models.IntegerField(blank=True, default=9)
    option_point_10th = models.IntegerField(blank=True, default=10)

    def __str__(self):
        return str(self.quizKey)

class UserAnswer(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(CustomUser, related_name='user_id_userAnswer',blank=False, null=False, on_delete=models.CASCADE)
    question_id = models.ForeignKey(Questions_V2, related_name='question_userAnswer_id', blank=True, null=True, on_delete=models.CASCADE)
    user_answer = models.IntegerField()
    correct_answer = models.IntegerField()
    date_submitted = models.DateTimeField(blank=True, null=True, default=datetime.datetime.now)
    
    def __str__(self):
        return f'{self.user_id.username} answered quiz {self.question_id.id}'
    
class UserScore(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(CustomUser, related_name='user_id_userResult',blank=False, null=False, on_delete=models.CASCADE)
    quiz_id = models.ForeignKey(Quizzes_V2, related_name='quiz_userResult_id', blank=True, null=True, on_delete=models.CASCADE)
    score = models.IntegerField()
    got_help = models.BooleanField()
    date_submitted = models.DateTimeField(blank=True, null=True, default=datetime.datetime.now)
    
    def __str__(self):
        return f'{self.user_id.username} score {self.score} for {self.quiz_id.title}'
    
class Like(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(CustomUser, related_name='user_id_like',blank=False, null=False, on_delete=models.CASCADE)
    quizV2_id = models.ForeignKey(Quizzes_V2, related_name='quizV2_like_id', blank=True, null=True, on_delete=models.CASCADE)
    test_id = models.ForeignKey(Quizzes_Pointy, related_name='test_like_id',blank=True, null=True, on_delete=models.CASCADE)
    date_submitted = models.DateTimeField(blank=True, null=True, default=datetime.datetime.now)

    class Meta:
        unique_together = (('user_id', 'test_id'), ('user_id', 'quizV2_id'))

    @property
    def quiz_id(self):
        return self.quizV2_id or self.test_id

    def __str__(self):
        return f'{self.user_id.username} liked {self.quiz_id.title}'

class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    comment_text = models.CharField(blank=False, null=False, max_length=255)
    submitter_id = models.ForeignKey(CustomUser, related_name='user_comment_id', blank=False, null=True, on_delete=models.SET_NULL)
    quizV2_id = models.ForeignKey(Quizzes_V2, related_name='quizV2_comment_id', blank=True, null=True, on_delete=models.CASCADE)
    test_id = models.ForeignKey(Quizzes_Pointy, related_name='test_comment_id',blank=True, null=True, on_delete=models.CASCADE)
    date_submitted = models.DateTimeField(blank=True, null=True, default=datetime.datetime.now)
    verified = models.BooleanField(default=True)

    @property
    def quiz_id(self):
        return self.quizV2_id or self.test_id

    def __str__(self):
        return f'{self.submitter_id.username} commented on {self.quiz_id.title}'

class Watch_List(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(CustomUser, related_name='user_watchList_id',
                                blank=False, null=False, on_delete=models.CASCADE)
    quizV2_id = models.ForeignKey(
        Quizzes_V2, related_name='quizV2_watchList_id', blank=True, null=True, on_delete=models.CASCADE)
    test_id = models.ForeignKey(Quizzes_Pointy, related_name='test_watchList_id',
                                blank=True, null=True, on_delete=models.CASCADE)
    date_submitted = models.DateTimeField(
        blank=True, null=True, default=datetime.datetime.now)

    class Meta:
        unique_together = (('user_id', 'test_id'), ('user_id', 'quizV2_id'))

    @property
    def quiz_id(self):
        return self.quizV2_id or self.test_id

    def __str__(self):
        return f'{self.user_id.username} liked {self.quiz_id.title}'

class History(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(CustomUser, related_name='user_history_id',
                                blank=False, null=True, on_delete=models.CASCADE)
    quizV2_id = models.ForeignKey(
        Quizzes_V2, related_name='quizV2_history_id', blank=True, null=True, on_delete=models.CASCADE)
    test_id = models.ForeignKey(Quizzes_Pointy, related_name='test_history_id',
                                blank=True, null=True, on_delete=models.CASCADE)
    date_submitted = models.DateTimeField(
        blank=True, null=True, default=datetime.datetime.now)

    @property
    def quiz_id(self):
        return self.quizV2_id or self.test_id

    def __str__(self):
        return f'{self.date_submitted} history submitted'

class Report(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(CustomUser, related_name='user_report_id', blank=False, null=True, on_delete=models.SET_NULL)
    questionQuiz_id = models.ForeignKey(Questions_V2, related_name='question_report_id', blank=True, null=True, on_delete=models.CASCADE)
    questionPointy_id = models.ForeignKey(Pointy_Questions, related_name='questionPointy_report_id', blank=True, null=True, on_delete=models.CASCADE)
    title = models.CharField(blank=False, null=False, max_length=255)
    description = models.CharField(blank=False, null=False, max_length=255)
    date_submitted = models.DateTimeField(blank=True, null=True, default=datetime.datetime.now)

    @property
    def question_id(self):
        return self.questionQuiz_id or self.questionPointy_id
    
    def __str__(self):
        return f'{self.question_id} reported on {self.date_submitted}'
    
class DailyReward(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(CustomUser, related_name='user_dailyReward_id', blank=False, null=True, on_delete=models.SET_NULL)
    date = models.DateField(blank=True, null=True, default=datetime.datetime.now)

    def __str__(self):
        return f'{self.user_id.username} reward'