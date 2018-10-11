function map(transformFn){
    const inputObservable = this;
    const outputObservable = 
        createObservable(function subscribe(outputObserver){
            inputObservable.subscribe({
                next: function(x){
                    const y = transformFn(x);
                    outputObserver.next(y);
                },
                error: e => outputObserver.error(e),
                complete: () => outputObserver.complete() 
            });
        });
    return outputObservable;
}

function filter(conditionFn){
    const inputObservable = this;
    const outputObservable = 
        createObservable(function subscribe(outputObserver){
            inputObservable.subscribe({
                next: function(x){
                    if(conditionFn(x)){
                        outputObserver.next(x);
                    }
                },
                error: e => outputObserver.error(e),
                complete: () => outputObserver.complete() 
            });
        });
    return outputObservable;
}

function delay(period){
    const inputObservable = this;
    const outputObservable = 
        createObservable(function subscribe(outputObserver){
            inputObservable.subscribe({
                next: function(x){
                    setTimeout(function(){
                        outputObserver.next(x);
                    }, period);
                },
                error: e => outputObserver.error(e),
                complete: () => outputObserver.complete() 
            });
        });
    return outputObservable;
}

function createObservable(subscribe) {
    return {
        subscribe: subscribe,
        map: map,
        filter: filter,
        delay: delay
    };
}

const clickObservable = createObservable(function subscribe(obs){
    document.addEventListener('click', obs.next);
});

const arrayObservable = createObservable(function subscribe(obs){
    [10,20,30].forEach(obs.next);
    obs.complete();
});

const observer = {
    next: function nextCallback(data) {
        console.log(data);
    },
    error: function errorCallback(err) {
        console.error(err);
    },
    complete: function completeCallback() {
        console.log('done');
    }
}

arrayObservable
    .map(x => x/10)
    .filter(x => x !== 2)
    .subscribe(observer);

clickObservable
    .map(ev => ev.clientX)
    .filter(x => x < 200)
    .delay(2000)
    .subscribe(observer);