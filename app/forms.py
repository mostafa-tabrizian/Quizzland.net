from django import forms

class SearchForm(forms.Form):
    searchInput = forms.CharField(
        max_length=50, min_length=3,
        label="", required=True,
        widget=forms.TextInput(
            attrs={
                'class': 'header__searchInput tx-al-r',
                'placeholder': '...جستجو',
            }
        )
    )

class NewsletterForm(forms.Form):
    emailInput = forms.EmailField(
        max_length=100, required=True,
        label="",
        widget=forms.EmailInput(
            attrs={
                'class': 'input',
                'name': "userEmail",
                'type': "email",
                'placeholder': '  ایمیل ...'
            }
        )
    )
    usernameInput = forms.CharField(
        max_length=20, required=True,
        min_length=3, label="",
        widget=forms.TextInput(
            attrs={
                'class': 'input input__userName',
                'name': "userName",
                'type': "text",
                'placeholder': '  نام ...'
            }
        ) 
    )

    favoriteCategory = forms.CharField(
        max_length=100, required=True,
        label="",
        widget=forms.Textarea(
            attrs={
                'class': 'newsletter__categoryOptions__selectedByUser',
                'name': "chosenCategory",
            }
        )
    )