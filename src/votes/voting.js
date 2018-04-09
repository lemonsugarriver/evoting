module.exports =(db) => {
    const ethJsUtil = require('ethereumjs-util');
    const offlinetx = require("../crypto/offlinetx")(db);
    const cache = require('../cache/txHelper.js')(db);

    return {

        getEligibleVoter: async function(voter) {
            let voterData = await db.electionInstance.methods.eligibleVoters(voter).call();
            return {"eligible":voterData[0], "blindedVote": voterData[1],"blindlySignedVote":voterData[2]};
        },

        getBlindedVotes: async function(blindedVotes) {
            let blindedVotesData = await db.electionInstance.methods.blindedVotes(blindedVotes).call();
            return {"address":blindedVotesData};
        },

        getVotes: async function(votes) {
            let votesData = await db.electionInstance.methods.votes(votes).call();
            return {"votes":votesData};
        },

        getUsedSignatures: async function(usedSignatures) {
            let signaturesData = await db.electionInstance.methods.usedSignatures(usedSignatures).call();
            return {"usedSignatures":signaturesData};
        },

        getQuestion: async function() {
            let questionData = await db.electionInstance.methods.question().call();
            return {"votes":questionData};
        },

        postEligibleVoter: async function(voter) {

            let txHash= db.electionInstance.methods.addEligibleVoter(voter).send({from:db.accounts[0]});
            /*    let tx = db.electionInstance.methods.addEligibleVoter(voter);
                let rawTx = await offlinetx.getTxJson(tx, {from: db.accounts[0], gasPrice: "0x00"});

                cacheValues = await cache.writeUnsentTxToCache(rawTx);
                cache.setCache(cacheValues[0], JSON.stringify(cacheValues[1]));
            */
            return txHash;
        },

        deleteEligibleVoter: async function(voter) {
            let txHash = db.electionInstance.methods.removeEligibleVoter(voter).send({from: db.accounts[0]});
            return txHash;
        },

        castVote: async function(choiceCode, blindedVote, blindlySingedVote) {
            let txHash = db.electionInstance.methods.Vote(choiceCode, blindedVote, blindlySingedVote).send({from: db.accounts[0], gas: 2000000});
            return txHash;
        },

        postRequestBlindSig: async function(blindedVote) {
            let txHash = db.electionInstance.methods.requestBlindSig(blindedVote).send({from: db.accounts[0]});
            return txHash;
        },

        postWriteBlindSig: async function(voter, blindSig) {
            let txHash = db.electionInstance.methods.writeBlindSig(voter, blindSig).send({from: db.accounts[0]});
            return txHash;
        },

        postVerifyBlindSig: async function(vote, blindedMessage, blindSig) {
            let txHash = db.electionInstance.methods.verifyBlindSig(vote,blindedMessage,blindSig).send({from: db.accounts[0]});
            return txHash;
        },

    }};
