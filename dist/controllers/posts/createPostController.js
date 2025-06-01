"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = void 0;
const dataBase_1 = __importDefault(require("../../config/dataBase"));
const createPost = async (req, res) => {
    try {
        // 1. Получаем ID автора из авторизованного запроса
        const authorId = req.user?.id;
        if (!authorId) {
            res.status(401).json({ message: "Неавторизованный запрос" });
            return;
        }
        // 2. Извлекаем из тела запроса заголовок, описание, тип доступа и файл (если есть)
        const { title, description, accessType } = req.body;
        // accessType ожидает одно из значений: 'public' | 'private' | 'friends'
        const normalizedAccessType = (accessType || "public").toString().trim().toLowerCase();
        if (!title || !description) {
            res
                .status(400)
                .json({ message: "Заполните обязательные поля: title и description" });
            return;
        }
        if (!["public", "private", "friends"].includes(normalizedAccessType)) {
            res
                .status(400)
                .json({
                message: "Неверный параметр accessType. Допустимые значения: public, private, friends",
            });
            return;
        }
        // 3. Если пришло изображение, формируем путь; иначе оставляем null
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
        // 4. Вставляем новую запись в таблицу posts, указывая access_type
        //    Поле is_public у вас в схеме больше не критично для логики,
        //    но мы всё равно заполним его (true для public, false в остальных случаях).
        const isPublicFlag = normalizedAccessType === "public";
        const insertPostResult = await dataBase_1.default.query(`
        INSERT INTO public.posts
          (author_id, title, description, img, is_public, access_type)
        VALUES
          ($1, $2, $3, $4, $5, $6)
        RETURNING id;
      `, [authorId, title, description, imagePath, isPublicFlag, normalizedAccessType]);
        const newPostId = insertPostResult.rows[0].id;
        // 5. В зависимости от accessType, заполняем таблицу post_access
        //    - public: ничего не делаем
        //    - private: вставляем только автора
        //    - friends: берем всех текущих друзей автора + автора
        if (normalizedAccessType === "private") {
            // Если доступ только для автора — добавляем одну запись
            await dataBase_1.default.query(`
          INSERT INTO public.post_access (post_id, user_id)
          VALUES ($1, $2);
        `, [newPostId, authorId]);
        }
        else if (normalizedAccessType === "friends") {
            // 5.1. Достаём массив friends из user_friends для данного автора
            const friendsResult = await dataBase_1.default.query(`
          SELECT friends
          FROM public.user_friends
          WHERE user_id = $1;
        `, [authorId]);
            // Если записи в user_friends ещё нет, считаем, что у автора пока нет друзей
            const friendsArray = friendsResult.rows.length > 0 ? friendsResult.rows[0].friends : [];
            // 5.2. Собираем итоговый массив userId для post_access: [authorId, ...friendsArray]
            const accessUserIdsSet = new Set();
            accessUserIdsSet.add(authorId);
            for (const fid of friendsArray) {
                // На всякий случай игнорируем null или нечисловые значения
                if (typeof fid === "number") {
                    accessUserIdsSet.add(fid);
                }
            }
            // 5.3. Вставляем записи в post_access
            const insertAccessText = "INSERT INTO public.post_access (post_id, user_id) VALUES ($1, $2);";
            for (const uid of accessUserIdsSet) {
                await dataBase_1.default.query(insertAccessText, [newPostId, uid]);
            }
        }
        // (если accessType = 'public' — ничего не делаем, т.к. доступ открыт всем)
        // 6. Отправляем ответ клиенту
        res.status(201).json({
            message: "Пост успешно создан",
            post: {
                id: newPostId,
                title,
                description,
                img: imagePath,
                accessType: normalizedAccessType,
            },
        });
    }
    catch (error) {
        console.error("Ошибка при создании поста:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};
exports.createPost = createPost;
