In this file, the Problems encountered in this Project are written down. In futher work, theese problems should be taken into account:

# Technical problems and learnings
## 1) To use Interceptor inject it in app.config like this:
<pre>
providers: [
provideRouter(routes),
provideHttpClient(withInterceptorsFromDi()),
{
    provide: HTTP_INTERCEPTORS,
    useClass: MockInterceptor,
    multi: true
},
</pre>

And <strong>not</strong> the injection in app.module. This was relevant in the older versions and ChatGPT has outdated information (state July 2024).

## 2) Problems with injecting HttpClient in the service.
If constructor-injecting the HttpClient in the service, there is a strange error that blocks the whole app. To fix it, I used a dirty fix injecting the module into the app.component, than sending it to httpclient-provider.service to store it there and than injecting it into all the other services to provide HttpClient. 

app.component.ts
<pre>
constructor(httpClient: HttpClient, httpProvider: HttpclientProviderService, ...) {
    // ...
    httpProvider.setHttpClient(httpClient);
}
</pre>

httpclient-provider.service.ts
<pre>
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HttpclientProviderService {
    http!: HttpClient;

    setHttpClient(http: any): void {
        this.http = http;
    }

    getHttpClient(): HttpClient {
        return this.http;
    }
}
</pre>

Any service that needs HttpClient:
<pre>
constructor( private httpProvider: HttpclientProviderService, ...) {
    // ...
}

// ...
// place where it is needed, instead of HttpClient this.httpProvider.getHttpClient() is used
return this.httpProvider.getHttpClient().post(url, data, httpOptions);
</pre>

Still not sure how to fix the issue in the right way.

## 3) Observable is very useful

One of the big issues with Angular reacting to server and other components updates was solved using obervable pattern, for that the service was created:
<pre>
import { Injectable } from '@angular/core';

export interface Updateable {
  update(): void;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateEverythingService {

  subscribers = new Set&#60;Updateable&#62;();

  subscribeToUpdates(object: Updateable) {
    this.subscribers.add(object);
  }

  updateAll() {
    this.subscribers.forEach(subscriber => subscriber.update());
  }
}
</pre>

Than, any subscribed component recieves updates and every other element can trigger updates.

Problem: there is no restrictions as to what element is allowed to trigger the updates.

## 4) Use box-model and positioning of the elements in css as it is ment by css

The problem was that due to lack of experience, I used formulas like <code>height: calc((100vh - 170px) / 2 - 36px);</code> to position and scale the elements. Because of that is was really hard to work with elements if futher should be added. So in the next project, I will use the positioning in the correct way.

# Management problems and learnings

## 1) Do not underestimate the time you need for the project

It was the university project and we thought such topic should not take too long, so we were not hurrying at the beginning. Consiquently, it was very stressful to work in the last two weeks as the deadline was approaching and we only had 60% of the project done. Still, it was successful, but could be much more pleasant if we planned the work appropriately.

## 2) Write down what each of the team member is working on, document very exactly what the task is

In the first couple of weeks we used to use Jira to document what we were working on, but soon became lazy. So, at some point no one was knowing what others are working on, and so if there is a bug, there was no evidence to prove that a sertain person should fix it.

So, as mentioned, the way the code-tasks should be completed were only discussed orally. That way quality assurance was hard to execute due to the room for the interpretation. In other words, if you are asked to do a registration page, you could just put two fields for name and password and a button to register and formally the task is complete. Or you could add password-validation, the like to the reset-password-page and so on. So, you want to have the second result, write down very exactly what you want to have. Everything you don't write will not be implemented.

Also note:
In the Project, you have team members with different amount of expertise and experience. If you split the tasks evenly between everyone, you will find out that some tasks are not done, as a reason for that you will get "I didn't know how to do it". So, ask your team memebrs what they are capable of and give them the tasks they are ready to perform. But still, there is nothing bad with taking time to help others, but there is a chance that you will find yourself doing everything for everyone.

"No, I can't help futher because it's 1 AM and I want to sleep" should have came from me insted of "Okay, lets fix the bug you could actually fix with ChatGPT but didn't figure out how to copy the code".

## 3) Use push-reqests and push all the members to work in their own branches

There were no push requests what sometimes let huge bugs crawl with the pushes. And pushing into "main" directly is a very bad idea if you want not to loose all your progress two hours before the presentation.

## 4) Define the language you are using

We come from Germany and so some functions, variables and so on are sometimes written in German and sometimes in English. We could easily avoid it if we talked about it at the beginning. It led to problems like the api-endpoint has <i>password</i> with <i>t</i> at the end (like <i>/getPasswort</i>), and it is being called from the frontend like <i>/getPassword</i>. As a result the whole team is busy for a couple of hours because to the misspelling of the word. Best case scenario, write down what the language is somewhere in Confuence so that every memeber can access it.

## 5) TEST!

You shouldn't say your component is finished if there are no tests. That was the problem we had, because we only started testing at the end and had to fix a lot of bugs in the last two weeks.

## 6) Develop designs early enough

We started working on UI and UX-Design only as we had most of the components ready. As a result a lot of html-code had to be rewritten because you couldn't add styles to it.

## 7) Learn during the project 

Sometimes I wouldn't use some features like f. e. forms of the html or some advanced http-requests because I am not sure how it works and have never done it before. It is important to force yourself to learn new topics and see every new project as a possibility to improve, and to quickly and dirty finish your work.