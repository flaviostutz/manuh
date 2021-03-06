var manuh = require('./manuh');
var assert = require('assert');

describe('manuh client-side lightweight topic infrastructure', function() {

    beforeEach(function() {
        manuh.manuhData.topicsTree = {}; //manual reset
    });

    describe('topic creation', function() {
        describe('manuh._createTopic()', function() {

            it( 'should return a simple topic', function(){
                var topic = manuh.manuhFunctions._createTopic('topic_1');
                assert.equal(topic.name, 'topic_1');
                assert.equal(topic.subscriptions.length, 0);
            });
            it( 'should create a topic with parent and relate them in both topics (parent and child)', function(){
                var topic1 = manuh.manuhFunctions._createTopic('topic_1');
                var topic2 = manuh.manuhFunctions._createTopic('topic_2', topic1);
                assert(topic1.topic_2);
                assert.equal(topic1.topic_2, topic2);
                assert.equal(topic1.topic_2.name, 'topic_2');
                assert.equal(topic2.parent, topic1);
            });
        });

        describe('manuh._resolveTopicsByPathRegex()', function() {

            it ('should return null', function() {
                var topics = manuh.manuhFunctions._resolveTopicsByPathRegex('');
                assert.equal(topics, null);
            });
            it ('should return an array with 1 topic created based on a simple name (path)', function() {
                var topics = manuh.manuhFunctions._resolveTopicsByPathRegex('simple_topic');
                assert.equal(topics.length, 1);
                assert.equal(topics[0].name, 'simple_topic');
                assert.equal(topics[0].parent, manuh.manuhData.topicsTree);
            });
            it ('should return an array with 2 topics created based on a the name (charol/manuh)', function() {
                var topics = manuh.manuhFunctions._resolveTopicsByPathRegex('charol/manuh');
                assert.equal(topics.length, 2);
                assert.equal(topics[0].name, 'charol');
                assert.equal(topics[1].name, 'manuh');

                assert.equal(topics[0].manuh, topics[1]);

                assert.equal(topics[0].parent, manuh.manuhData.topicsTree);
                assert.equal(topics[1].parent, topics[0]);
            });
            it ('should return an array with 3 topics created based on a the name (charol/manuh/rhelena)', function() {
                var topics = manuh.manuhFunctions._resolveTopicsByPathRegex('charol/manuh/rhelena');
                assert.equal(topics.length, 3);
                assert.equal(topics[0].name, 'charol');
                assert.equal(topics[1].name, 'manuh');
                assert.equal(topics[2].name, 'rhelena');

                assert.equal(topics[0].manuh, topics[1]);
                assert.equal(topics[1].rhelena, topics[2]);

                assert.equal(topics[0].parent, manuh.manuhData.topicsTree);
                assert.equal(topics[1].parent, topics[0]);
                assert.equal(topics[2].parent, topics[1]);
            });
        });

    });

    describe('topic find', function() {
        describe('manuh._resolveTopic()', function() {

            it('should return all the topics that matches the simple regex (charol/manuh)', function() {
                var topic = manuh.manuhFunctions._resolveTopic('charol/manuh');
                assert(topic);

                assert.equal(topic.name, 'manuh');
                assert.equal(topic.parent.name, 'charol');
            });
        });
    });

    describe('topic publish', function() {
        describe('manuh.publish()', function() {

            it ('should create the topics based on the path to publish (charol/manuh/rhelena)', function() {
                manuh.publish('charol/manuh/rhelena', '3 little girls!');

                assert(manuh.manuhData.topicsTree.charol);
                assert(manuh.manuhData.topicsTree.charol.manuh);
                assert(manuh.manuhData.topicsTree.charol.manuh.rhelena);

                assert.equal(manuh.manuhData.topicsTree.charol.name, 'charol');
                assert.equal(manuh.manuhData.topicsTree.charol.manuh.name, 'manuh');
                assert.equal(manuh.manuhData.topicsTree.charol.manuh.rhelena.name, 'rhelena');

                assert.equal(manuh.manuhData.topicsTree.charol.parent, manuh.manuhData.topicsTree);
                assert.equal(manuh.manuhData.topicsTree.charol.manuh.parent, manuh.manuhData.topicsTree.charol);
                assert.equal(manuh.manuhData.topicsTree.charol.manuh.rhelena.parent, manuh.manuhData.topicsTree.charol.manuh);

                assert.equal(Object.keys(manuh.manuhData.topicsTree).length, 1);
            });
            it ('should create and modify the topics based on the path to publish (charol/manuh/rhelena)', function() {
                manuh.publish('charol', '1 little girl!');
                manuh.publish('charol/manuh', '2 little girls!');
                manuh.publish('charol/manuh/rhelena', '3 little girls!');

                assert(manuh.manuhData.topicsTree.charol);
                assert(manuh.manuhData.topicsTree.charol.manuh);
                assert(manuh.manuhData.topicsTree.charol.manuh.rhelena);

                assert.equal(manuh.manuhData.topicsTree.charol.name, 'charol');
                assert.equal(manuh.manuhData.topicsTree.charol.manuh.name, 'manuh');
                assert.equal(manuh.manuhData.topicsTree.charol.manuh.rhelena.name, 'rhelena');

                assert.equal(manuh.manuhData.topicsTree.charol.parent, manuh.manuhData.topicsTree);
                assert.equal(manuh.manuhData.topicsTree.charol.manuh.parent, manuh.manuhData.topicsTree.charol);
                assert.equal(manuh.manuhData.topicsTree.charol.manuh.rhelena.parent, manuh.manuhData.topicsTree.charol.manuh);

                assert(!manuh.manuhData.topicsTree.romeu);
                manuh.publish('romeu', '1 funny boy!');
                assert(manuh.manuhData.topicsTree.romeu);

                assert.equal(Object.keys(manuh.manuhData.topicsTree).length, 2);
            });

        });

        describe('topic subscription', function() {
            describe('manuh.subscribe()', function() {

                it ('should create the topics based on the path to subscribe (charol/manuh/rhelena)', function() {
                    manuh.subscribe('charol/manuh/rhelena', function(msg){});

                    assert(manuh.manuhData.topicsTree.charol);
                    assert(manuh.manuhData.topicsTree.charol.manuh);
                    assert(manuh.manuhData.topicsTree.charol.manuh.rhelena);

                    assert.equal(manuh.manuhData.topicsTree.charol.name, 'charol');
                    assert.equal(manuh.manuhData.topicsTree.charol.manuh.name, 'manuh');
                    assert.equal(manuh.manuhData.topicsTree.charol.manuh.rhelena.name, 'rhelena');

                    assert.equal(manuh.manuhData.topicsTree.charol.parent, manuh.manuhData.topicsTree);
                    assert.equal(manuh.manuhData.topicsTree.charol.manuh.parent, manuh.manuhData.topicsTree.charol);
                    assert.equal(manuh.manuhData.topicsTree.charol.manuh.rhelena.parent, manuh.manuhData.topicsTree.charol.manuh);

                    assert.equal(Object.keys(manuh.manuhData.topicsTree).length, 1);
                });
                it ('should create the topics based on the path to subscription (charol/manuh/rhelena)', function() {
                    manuh.subscribe('charol', function(msg){});
                    manuh.subscribe('charol/manuh', function(msg){});
                    manuh.subscribe('charol/manuh/rhelena', function(msg){});

                    assert(manuh.manuhData.topicsTree.charol);
                    assert(manuh.manuhData.topicsTree.charol.manuh);
                    assert(manuh.manuhData.topicsTree.charol.manuh.rhelena);

                    assert.equal(manuh.manuhData.topicsTree.charol.name, 'charol');
                    assert.equal(manuh.manuhData.topicsTree.charol.manuh.name, 'manuh');
                    assert.equal(manuh.manuhData.topicsTree.charol.manuh.rhelena.name, 'rhelena');

                    assert.equal(manuh.manuhData.topicsTree.charol.parent, manuh.manuhData.topicsTree);
                    assert.equal(manuh.manuhData.topicsTree.charol.manuh.parent, manuh.manuhData.topicsTree.charol);
                    assert.equal(manuh.manuhData.topicsTree.charol.manuh.rhelena.parent, manuh.manuhData.topicsTree.charol.manuh);

                    assert(!manuh.manuhData.topicsTree.romeu);
                    manuh.subscribe('romeu', function(msg){});
                    assert(manuh.manuhData.topicsTree.romeu);

                    assert.equal(Object.keys(manuh.manuhData.topicsTree).length, 2);

                    assert.equal(manuh.manuhData.topicsTree.romeu.subscriptions.length, 1);
                    assert.equal(typeof(manuh.manuhData.topicsTree.romeu.subscriptions[0].onMessageReceived), 'function');
                });

                it ('should create 3 topics based on 1 subscription (charol/manuh/rhelena)', function() {
                    manuh.subscribe('charol/manuh/rhelena', function(msg){});

                    assert(manuh.manuhData.topicsTree.charol);
                    assert(manuh.manuhData.topicsTree.charol.manuh);
                    assert(manuh.manuhData.topicsTree.charol.manuh.rhelena);

                    assert.equal(manuh.manuhData.topicsTree.charol.name, 'charol');
                    assert.equal(manuh.manuhData.topicsTree.charol.manuh.name, 'manuh');
                    assert.equal(manuh.manuhData.topicsTree.charol.manuh.rhelena.name, 'rhelena');

                    assert.equal(manuh.manuhData.topicsTree.charol.parent, manuh.manuhData.topicsTree);
                    assert.equal(manuh.manuhData.topicsTree.charol.manuh.parent, manuh.manuhData.topicsTree.charol);
                    assert.equal(manuh.manuhData.topicsTree.charol.manuh.rhelena.parent, manuh.manuhData.topicsTree.charol.manuh);


                    assert.equal(Object.keys(manuh.manuhData.topicsTree).length, 1);

                    assert.equal(manuh.manuhData.topicsTree.charol.manuh.rhelena.subscriptions.length, 1);
                    assert.equal(typeof(manuh.manuhData.topicsTree.charol.manuh.rhelena.subscriptions[0].onMessageReceived), 'function');
                });
                it ('should pub-sub in the bus and check the subscription effect (charol/manuh/rhelena)', function(done) {
                    var received = null;
                    manuh.subscribe('charol/manuh/rhelena', function(msg){
                        received = msg;
                        assert.equal(received, 'test');
                        done();
                    });
                    assert(!received);

                    manuh.publish('charol/manuh/rhelena', 'test');

                });

                it ('should pub-sub in 2 topics changing the same var and check the subscription effect', function(done) {
                    var received = null;
                    manuh.subscribe('charol/manuh', function(msg){
                        received = msg;
                    });
                    manuh.subscribe('charol/manuh/rhelena', function(msg){
                        received = msg;
                    });
                    assert(!received);

                    manuh.publish('charol/manuh', 'manuh');
                    manuh.publish('charol/manuh/rhelena', 'rhelena');

                    setTimeout(function(){
                        assert.equal(received, 'rhelena');
                        done();
                    }, 10);

                });

                it ('should pub-sub in 2 topics with sub in 1 changing the same var and varying the pub-delay', function(done) {
                    var received = null;
                    manuh.subscribe('charol/manuh/rhelena', function(msg){
                        received = msg;
                    });
                    assert(!received);


                    manuh.manuhData.__publishCallbackInvokeIntervalDelay = 30; //change the delay of the callback invoke
                    manuh.publish('charol/manuh', 'manuh');
                    manuh.publish('charol/manuh/rhelena', 'rhelena');

                    setTimeout(function(){
                        assert(!received);
                        done();
                    }, 10); //as the interval delay of the callback invoke was 15, the received var should still be null
                    setTimeout(function(){
                        assert.equal(received, 'rhelena');
                        done();
                    }, 50);

                });


            });
        }); //with subscriptions

    });

});
