exports.bemVindo = async (req, res, next) => {
   try {
      return res.status(200).send({ response: true, data: "Seja bem vindo(a)!" });
   } catch (error) {
      return res.status(500).send({ response: false, error: error });
   }
};
