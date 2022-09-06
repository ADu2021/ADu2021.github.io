---
title: Java&Android Debug Log
catalog: true
date: 2022-08-28 23:57:36
subtitle:
header-img: https://i.imgur.com/qVj4cCe.jpg
tags:
- Java
- Android
categories:
- Development
---

# Android Studio 摸索记录

小学期要用Android Studio开发，于是先自己试试，发现有很多需要适应的地方，于是把一些bug/需求的解决方式记录下来。

## Week2：瞎玩

- bug：使用jetpack：navigation时，gradle编译出现“Could not find org.jetbrains.kotlin:kotlin-stdlib:”错误，网上的方案都没有用
  
  解决方案：上方工具栏Tools->Kotlin->Configure Kotlin in Project->Android，自动配置就好了（好像是在gradle里面自动加了ktx相关的几条依赖）

- 问题：使用了自带侧边栏的那个Project模板，他动作的触发器在哪里？
  
  好像navigation已经实现了，所以不需要触发器。
  
  新建一个fragment_xxx.xml，然后添加到navigation（graph）中，然后再activity_main_drawer.xml里添加这个（侧边栏布局），最后在MainActivity.java中mAppBarConfiguration变量里添加对应的id（这个用来告诉顶部导航栏这是顶级fragment，不要生成返回按钮）

- new了一个java.net.URL，报java.net.malformedurlexception
  
  解决：try-catch，捕获异常即可。
  
  *Note：其实应该充分利用Java语言的这种异常捕获的特性。还有就是如果出现那种闪退的RE，先套一层try-catch语句看看除了什么错会比较不错。*

- 从站点读取rss时，报Cleartext HTTP traffic not permitted错
  
  解决：use https instead of http

- bug：`FATAL EXCEPTION：Attempt to invoke virtual method 'void android.widget.TextView.setText(java.lang.CharSequence)' on a null object reference`
  
  原因：不能从mainActivity中调用findViewById(R.id.xx)来获得另一个fragment里面的resources
  
  解决：不会解决（模板的结构没那么简单emm），但是把逻辑都丢给fragment自己处理就不存在这个问题了。

- bug：（接着上一个bug，）fragment自己也在调用getViewById的时候return null了。
  
  解决：reason：调用位于OnCreateView，应该在OnViewCreader处调用。这里可以参考官方文档中fragment 的life cycle。
  
  *Note：Activity和Fragment都有自己的life cycle，具体表现就是可以重写各种onXxx函数，用于控制相应生命周期的行为。*

- bug：通过Navigation.findNavController(v).navigate(R.id.contentFragment);转换fragment时，出现FATAL ERROR：Unable to instantiate fragment : could not find Fragment constructor
  
  reason：因为ContentFragment是用navigation graph里面的图形界面创建的，他默认是一个访问类型（default）的class，但是这里应该是一个public的类。
  
  solution：class定义前面加上public即可。注意：ContentFragment这个类应该有一个public的空构造函数，不过java会默认生成就是了，故不用实现任何构造函数即可。

- 需求：显示/处理Html文本（parse HTML）
  
  方案1：use webview and it's loadData method
  
  方案2：use `HtmlCompat.fromHtml(raw_text,HtmlCompat.FROM_HTML_MODE_LEGACY)` function

- bug：webView组件在加载图片的时候，加载的图片的那个宽度比屏幕宽度大，很丑。
  
  https://stackoverflow.com/questions/10395292/android-webview-scaling-image-to-fit-the-screen 相当于在html内嵌了style

- 需求：改变模板自带的Toolbar的title，总不能让他默认显示我fragment的名字吧。
  
  方案：来一个`private androidx.appcompat.widget.Toolbar toolbar`的变量获取toolbar对象，在MainActivity的`onStart()`调用`toolbar.setTitle();`。或者fragment的`onViewCreated()`里面先获取MainActivity，再调用MainActivity里自己实现的一个控制接口。
  
  ```java
   MainActivity mainActivity = (MainActivity) getContext();
   mainActivity.setBarTitle("<Fragment Title>");
  ```

- 需求：实现一个新闻列表（比如从rss feed里显示title和abstract）
  
  实现：用RecyclerView。参见[Create dynamic lists with RecyclerView](https://developer.android.com/develop/ui/views/layout/recyclerview)
  
  基本就是实现三个部分：首先是用一个.xml定义列表里每个unit的样式；然后创建一个CustomAdapter（其中有一个ViewHolder内部类用于接收unit的样式并定义其行为，类似于placeHolder占位符），Adapter实现占位的创建和绑定（赋予其真正的数据）等函数；最后在activity/fragment里面调用这个CustomAdapter类管理RecyclerView。文档写得挺清楚的，就是实现起来花一点时间。
  
  - 需求：上面那个用RecyclerView实现的列表，我想让两个unit之间有个空隙，怎么实现？
    
    [Stack Overflow](https://stackoverflow.com/questions/1598119/is-there-an-easy-way-to-add-a-border-to-the-top-and-bottom-of-an-android-view) 这样实现。相当于是用一些fancy的background绘制出了这种效果。*需要注意这样的话unit里面的文本最好设置android::margin，不然就会出现文本出框的现象。。*

- 问题：是不是还需要实现自己的`onSaveInstanceState()`函数啊。

- TODO：情景：在一大堆新闻列表里，我点进去了某一个（此时换fragment加载content），然后又退出来，这时候：如果重新https请求、处理、显示新闻列表岂不是很慢？如果能用一些变量存一些会好一些。就是要考虑清楚存在哪里。

## Week3 开发
- 需求：Tablayout在有太多的tab时候会挤到一起，怎么实现滑动？
实现：android:tabMode="scrollable"
bug：error: attribute android:tabMode not found.
solution：use setTabMode() instead

- 需求：添加图片资源
实现：点击IDE左侧的"Resource Manager"，+，Import Drawables即可

- 需求：给每个tab设置自己的（点击）行为
实现：tabLayout.addOnTabSelectedListener，实现public void onTabSelected(TabLayout.Tab tab)方法。
注意：实现那个方法中用到了tab.getText()的逻辑，如果创建时没有setText，是会返回null的。

- api中有用的信息：
"image"：在摘要页面显示，在文章中显示，需要保存
"publishTime"：在文章中显示，排序，搜索，需要保存
"keywords"：搜索，需要保存
"video"：在文章中显示，需要保存
"title"：在摘要页面显示，在文章中显示，需要保存
"content"：在摘要页面显示（部分），在文章中显示，需要保存
"publisher"：（来源），在文章中显示，需要保存
"category"：需要保存
**"page":页数，优化加载速度**

- 注意：TabLayout.Tab的getId()默认返回-1，自己定义id就不要用-1了。

- bug: Permission denied (missing INTERNET permission?)
solution:在manifest中添加<uses-permission android:name="android.permission.INTERNET" />

- 需求：自定义初始界面标题（toolbar.title）
实现：需要重载MainActivity的onStart函数（而不是在onCreate），在这里调toolbar.setTitle();
注意：fragment的onViewCreated函数调用应该是在activity的onCreate的super.onCreate里面，所以这时候activity的toolbar对象还没有初始化，是null。

- 需求：进场动画
实现：
RecyclerView：https://stackoverflow.com/questions/26724964/how-to-animate-recyclerview-items-when-they-appear
xml：android:animateLayoutChanges="true"

- 需求：Programmatically create a MaterialButton with Outline style
解决：https://stackoverflow.com/questions/60590968/set-materialbutton-style-to-textbutton-programmatically
为了达到圆角的效果还得再加上button.setCornerRadius(75);

- bug：在themes.xml中用全局style修改字体后，从隐藏到显示的新tab的字体并没有改变。
fix：https://stackoverflow.com/questions/31067265/change-the-font-of-tab-text-in-android-design-support-tablayout
note：似乎所有直接new出来的东西都不会过xml里的风格，需要programmatically设置字体。最后再管它们比较好一点。

- 数据库：Room(https://developer.android.com/training/data-storage/room/)
异步操作：RxJava
反正就是要把database的操作都放到一个新的线程上面。不过存的时候好像还是得回到MainThread上面来。

- roomdatabase：error: Cannot figure out how to save this field into database. You can consider adding a type converter for it.
solution：https://stackoverflow.com/questions/44986626/android-room-database-how-to-handle-arraylist-in-an-entity
要用到Gson，在gradle中implementation 'com.google.code.gson:gson:2.9.1'

- 一个搞笑的bug：本来加载出来的新闻里只有少数几条有照片，结果上下滑动几下之后，所有的新闻就都有图片了。。。。
解决方案：https://stackoverflow.com/questions/33835867/recyclerview-adapter-showing-wrong-images
note：一开始意识到是recyclerView回收机制造成问题的时候甚至想弃用recyclerView，，，得亏进行了一些个搜索。

- 需求：ImageView屏幕居中
实现：Parent View 设置android:gravity="center"

- bug：部分图片加载不出来
尝试：一开始以为还是recyclerView的问题，多种解决方案无果后，发现url为http的图片全都加载不出来而https的都可以，于是搜索之后很快就解决了。
solution：https://blog.csdn.net/wuqingsen1/article/details/103311349 （add android:usesCleartextTraffic="true" to application）
note：问题定位错了，浪费了几个小时。。。

- bug：还是有一张图片加载不出来
观察：这张图片尺寸很大，且注意到报错Canvas: trying to draw too large bitmap.
solution：Picasso (...).resize(0, 800).resize(1000,0).onlyScaleDown()(...)
note：这加载图片真不是件容易事儿。。。

- 需求：保存（新闻列表的）阅读位置
解决：每次从阅读文章退回的时候不要重新刷新即可

- note：能够及时和甲方（助教）沟通一些需求上不明确的点很重要。	

- bug：点击按钮打开DatePicker，如果连续（在DatePicker未打开前）点两下按钮，则crash，报错：
	java.lang.IllegalStateException: Fragment already added: MaterialDatePicker{4f3cc88} (1b47f65d-e0c6-42ee-b81b-63e07f7d6f44 tag=设置开始与截止日期)
solution：在onClick事件中加一条if(materialDatePicker.isAdded()) return;

- 需求：设置起始时间、截止时间（UI）
实现：MaterialDatePicker，通过泛型传入Pair<int,int>来实现DateRangePicker
获取时间参考https://stackoverflow.com/questions/58931051/materialdatepicker-get-selected-dates

- bug：Method callback = this.getClass().getMethod("parseJson", String.class);，其中parseJson(String)是父类的protected函数，但是callback无法调用
原因：调用callback的对象是另一个类，不在protected的涵盖范围内
解决：protected->public

- 神奇的发现：api接口中有个page参数（这个参数在文档里未给出），相当于同一搜索条件可以分页加载，这就使我们不用通过修改size来加载更多新闻了。（从O（n^2）到了O（n））
麻烦的是需要小部分重构（因为之前是用Array存的，不方便扩展，需要重构为ArrayList）。不过重构的时候顺便删掉了很多冗余的东西。