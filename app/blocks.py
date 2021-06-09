
tools = "   <div class='tools wrapper-sm flex flex-ai-c'>\
                <div class='tools__sort'>\
                    <div class='tools__sort__btn btn darkGls'>ترتیب بر اساس: \
                        <span class='tools__sort__current'>جدیدترین</span>\
                    </div>\
                    <div class='tools__sort__options__container fade-out'>\
                        <ul class='tools__sort__options'>\
                            <button class='darkGls' type='button'>جدیدترین</button>\
                            <button class='darkGls' type='button'>بهترین</button>\
                            <button class='darkGls' type='button'>الفبا</button>\
                        </ul>\
                    </div>\
                </div>\
                <div class='tools__numberOfResult'>\
                    <div class='tools__numberOfResult__btn darkGls btn'>تعداد نمایش: \
                        <span class='tools__numberOfResult__current'>16</span>\
                    </div>\
                    <div class='tools__numberOfResult__options__container fade-out'>\
                        <ul class='tools__numberOfResult__options'>\
                            <button class='darkGls' type='button'>16</button>\
                            <button class='darkGls' type='button'>32</button>\
                            <button class='darkGls' type='button'>48</button>\
                        </ul>\
                    </div>\
                </div>\
                <button class='tools__submit darkGls'></button>\
            </div>\
        "

def pageTravel (finalPage):
    return f"  <div class='pageTravel darkGls flex flex-jc-c flex-ai-c space-med'>\
                    <a class='pageTravel__arwLast' href=''></a>\
                    <div class='pageTravel__pages flex flex-jc-c flex-ai-c'>\
                        <a class='pageTravel__pages__last' href=''></a>\
                        <span class='pageTravel__pages__curr'></span>\
                        <a class='pageTravel__pages__next' href=''></a>\
                        <a class='pageTravel__pages__nextTwo' href=''></a>\
                        <div class='finalPage'>\
                            <span>.....</span>\
                            <a href='#'>\
                                {finalPage}\
                            </a>\
                        </div>\
                    </div>\
                    <a class='pageTravel__arwNext' href=''></a>\
                </div>\
            "

backBtn = "<button type='button' class='backBtn'>بازگشت</button>"