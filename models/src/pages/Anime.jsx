//importamos los hooks de React para mantener estado y ciclo de vida
import { useState, useEffect } from "react";

//importamos las funciones de lógica que comunican con la pai(crud)
import getAnimes from "../logic/getAnime";
import createAnime from "../logic/createAnime";
import deleteAnime from "../logic/deleteAnime";
import updateAnime from "../logic/updateAnime";

// importamos los elementos visuales
import AnimeCard from "../components/AnimeCard";
import AnimeFormulario from "../components/AnimeFormulario";
import AnimeUpdateFormulario from "../components/AnimeUpdateFormulario";

function Anime() {

    // Estado que almacena la lista de animes obtenida del backend
    const [animesState, setAnimesState] = useState([]);

    // Controla si se muestra o no el formulario de creacion
    const [show, setShow] = useState(false);

    //Controla si se muestra o no el formulario de edicon
    const [showUpdate, setShowUpdate] = useState(false);

    // Guarda el anime que se va a editar
    const [editAnime, setEditAnime] = useState(null);

    // useEffect con array vacio: se ejecuta solo una vez al montar el componente
    useEffect(() => {handleGetAnimes();}, []);

    // Obtiene la lista de animes desde la api
    function handleGetAnimes() {
        getAnimes()
            .then((data) => {
                // Guardamos los datos en el estado
                setAnimesState(data);
            })
            .catch((error) => console.error("Error fetching animes", error));
    }
    // Crea un nuevo anime
    function handleCreateAnime(animeAdd) {
        createAnime(animeAdd)
            .then((response) => {
                console.log(response);
                // Tras crear, volvemos a pedir la lista actualizada
                handleGetAnimes();
                // Cerramos el formulario de creación
                setShow(false);
            })
            .catch((error) => {
                console.error("Error creating Anime: ", error);
            });
    }

    //Elimina  un  anime  por la id
    function handleDeleteAnime(id) {
        deleteAnime(id)
            .then((response) => {
                console.log(response);
                //Tras borrar, recargamos la lista actuañizada
                handleGetAnimes();

            })
            .catch((error) => {
                console.error("Error deleting Anime: ", error);
            });
    }

    // Prepara el formulario de edicion
    function showUpdateForm(animeToUpdate) {
        // Guardamos el anime que se va a editar
        setEditAnime(animeToUpdate);
        // Mostramos el formulario de edicion
        setShowUpdate(true);
    }

        // cierra el formulario de edicion
    function closeForm() {
        setShowUpdate(false);
    }

    // Actualiza un anime existente
    function handleUpdateAnime(id, updateData) {
        updateAnime(id, updateData)
            .then((response) => {
                console.log(response);
                //tras actualizar recargamos la lista
                handleGetAnimes();
                // cerramos el formulario de edicion
                setShowUpdate(false);
            })
            .catch((error) => {
                console.error("Error updating Anime: ", error);
            });
    }

    // Alterna la visibilidad del formulario de creacion 
    function add() {
        setShow(!show);
    }
 
    //Renderizamos
    return (
        <section className="page">
            <h1 className="section-title">Página Anime</h1>
            <p className="section-subtitle">
                Descubre openings y escenas destacadas en un formato de reproductor.
            </p>

            <div className="anime-grid">
                {animesState.map((anime) => (
                    <AnimeCard 
                        key={anime.id} // Clave unica para react
                        propsAnimes={anime}  // Datos del anime
                        onDelete={handleDeleteAnime}  // Callback para borrar 
                        onUpdate={showUpdateForm} // Callback para editar 
                    />
                ))}
            </div>
            {/* Formulario de edicion(renderizado condicional)*/}
            {showUpdate && (
                <AnimeUpdateFormulario
                    animeToUpdate={editAnime}
                    onClose={closeForm}
                    onUpdateAnime={handleUpdateAnime}
                />
            )}

            {/* Botón para mostrar/ocultar formulario de creación*/ }
            <div className="botonesVG">
                <button className="btn-secondary" onClick={add}>
                    {show ? "Cerrar formulario" : "Agregar nuevo"}
                </button>
            </div>

            {/*Formulario de creación */}

            {show && <AnimeFormulario onAddAnime={handleCreateAnime} onClose={() => setShow(false)} />}
        </section>
    );
}
// Exportamos el componente para usarlo en el routing
export default Anime;
