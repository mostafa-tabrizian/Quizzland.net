const excludeWordsToSearch = () => {
    const wordList = [
        'کوییز', 'این', 'این', 'آن', 'انها', 'آنها', 'همه', 'دیگری', 'دیگر',
        'هر', 'هرکسی', 'هرچیزی', 'هرکدام', 'همه', 'کم', 'زیاد', 'بعضی',
        'هیچکدام', 'کسی', 'هیچ', 'چیزی', 'خود', 'خود', 'من', 'خودم',
        'او', 'خودش', 'ما', 'کردم', 'کردی', 'کرد', 'شما', 'هستی',
        'هستید', 'ما', 'چه', 'چی', 'قبل', 'بعد', 'بین', 'در', 'هم',
        'از', 'و', 'اگر', 'کوییز', 'کوئیز', 'یک', 'به', 'داشت', 'دارد',
        'رو', 'یک', 'تو', 'کدوم', 'های', 'میتونی', 'کنی', 'میشی',
        'بزنه', 'بزنی', 'پس', 'اونا', 'ببین', 'با', 'یه', 'ترین',
    

        'this', 'that', 'these', 'those', 'all', 'another', 'any',
        'anybody', 'anyone', 'both', 'each', 'either', 'everybody',
        'everyone', 'everything', 'few', 'many', 'neither', 'nobody',
        'none', 'no one', 'nothing', 'one', 'some', 'somebody',
        'someone', 'something', 'self', 'myself', 'yourself',
        'himself', 'herself', 'ourselves', 'yourselves',
        'themselves', 'who', 'whom', 'whose', 'which', 'what',
        'me', 'you', 'she', 'her', 'me', 'mine', 'your',
        'yours', 'her', 'hers', 'his', 'its', 'our', 'ours',
        'their', 'theirs', 'about', 'above', 'across', 'after',
        'against', 'along', 'among', 'around', 'at', 'before',
        'behind', 'below', 'beside', 'besides', 'between', 'beyond',
        'by', 'down', 'during', 'except', 'for', 'from', 'in',
        'inside', 'into', 'like', 'near', 'next', 'of', 'off',
        'on', 'onto', 'out', 'outside', 'over', 'past', 'since',
        'than', 'through', 'to', 'toward', 'under', 'unlike',
        'until', 'up', 'with', 'without', 'after', 'although',
        'as', 'as if', 'because', 'before', 'even though', 'If',
        'Since', 'So that', 'than', 'that', 'though', 'unless',
        'until', 'when', 'where', 'whether', 'while', 'is', 'the',
        'best', 'then', 'again', 'ever', 

        'quiz',

        'be', 'and', 'of', 'a', 'in', 'to', 'have', 'too',
        'it', 'i', 'that', 'for', 'you', 'he', 'with',
        'on', 'do', 'say', 'this', 'they', 'at', 'but',
        'we', 'his', 'from', 'that', 'not', 'can’t',
        'won’t', 'by', 'she', 'or', 'as', 'what', 'go',
        'their', 'can', 'who', 'get', 'if', 'would', 'her',
        'all', 'my', 'make', 'about', 'know', 'will',
        'as', 'up', 'one', 'time', 'there', 'year',
        'so', 'think', 'when', 'which', 'them', 'some',
        'me', 'people', 'take', 'out', 'into', 'just',
        'see', 'him', 'your', 'come', 'could', 'now',
        'than', 'like', 'other', 'how', 'then', 'its',
        'our', 'two', 'more', 'these', 'want', 'way',
        'look', 'first', 'also', 'new', 'because', 'day',
        'more', 'use', 'no', 'man', 'find', 'here', 'thing',
        'give', 'many', 'well', 'only', 'those', 'tell', 'one',
        'very', 'her', 'even', 'back', 'any –', 'good', 'woman',
        'through', 'us', 'life', 'child', 'there', 'work', 'down',
        'may', 'after', 'should', 'call', 'world', 'over', 'school',
        'still', 'try', 'in', 'as', 'last ', 'ask', 'need', 'too', 'feel',
        'three ', 'when',
    ]

    return wordList
}
 
export default excludeWordsToSearch;